import { NextFunction, Request, Response, RequestHandler } from "express";
import { prisma } from "../utils/prismaclient.js";
import { RouteError } from "../common/routeerror.js";
import HttpStatusCodes from "../common/httpstatuscode.js";
import { ShipRocketOrderSchema } from "../types/validations/shipRocket.js";
import axios from "axios";
import { OrderFulfillment } from "@prisma/client";

const getShiprocketToken = async () => {
    // Always fetch a new token to ensure validity
    const email = process.env.SHIPROCKET_EMAIL?.trim();
    const password = process.env.SHIPROCKET_PASSWORD?.trim();

    if (!email || !password) {
        console.error("Shiprocket credentials not found in environment variables");
        return null;
    }

    try {
        const response = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/auth/login",
            { email, password },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        const token = response.data.token;
        if (token) {
            await prisma.$transaction([
                prisma.shiprocketToken.deleteMany(),
                prisma.shiprocketToken.create({ data: { token } }),
            ]);
        }
        return token;
    } catch (error: any) {
        console.error("Shiprocket Auth Error:", error?.response?.status || error.message);
        console.error("Auth Error Details:", error?.response?.data?.message || "Unknown error");
        return null;
    }
};

const createShiprocketOrder: RequestHandler = async (req, res, next) => {
    const orderData = req.body;
    const shipToken = await getShiprocketToken();

    if (!shipToken) {
        // Don't throw error - save order to DB but return warning about Shiprocket
        console.warn("Shiprocket authentication failed - order will be saved locally only");

        // Still save the order to database
        try {
            await prisma.order.create({
                data: {
                    id: orderData.order_id,
                    userId: orderData.user_id || orderData.customer_id, // Use userId field from schema
                    total: orderData.sub_total,
                    paid: orderData.payment_method !== 'COD',
                    status: 'PENDING',
                    fulfillment: 'PENDING',
                    addressId: orderData.address_id, // Required address relation
                    items: {
                        create: orderData.order_items.map((item: any) => ({
                            productName: item.name,
                            color: item.sku.split('ARV')[1]?.charAt(0) || 'Default',
                            size: item.sku.split('ARV')[1]?.slice(1) || 'Default',
                            quantity: item.units,
                            priceAtOrder: item.selling_price,
                            productId: item.product_id || 'default-product-id', // Required product relation
                            productVariantId: item.variant_id || 'default-variant-id' // Required variant relation
                        }))
                    }
                }
            });

            res.status(HttpStatusCodes.CREATED).json({
                success: true,
                message: "Order saved successfully, but Shiprocket integration failed. Please check your Shiprocket credentials.",
                shiprocket_status: "failed",
                order_id: orderData.order_id
            });
            return;
        } catch (dbError: any) {
            console.error("Database error:", dbError);
            throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to save order");
        }
    }

    // Clean the billing address to remove pincode if present at the end
    if (orderData.billing_address && orderData.billing_pincode) {
        const pincodePattern = new RegExp(`\\s*-\\s*${orderData.billing_pincode}\\s*$`);
        orderData.billing_address = orderData.billing_address.replace(pincodePattern, '').trim();
    }

    // Try to fetch valid pickup locations, fallback to default if fails
    try {
        const locationsResponse = await axios.get(
            "https://apiv2.shiprocket.in/v1/external/settings/company/pickup",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${shipToken}`,
                }
            }
        );
        const locations = locationsResponse.data.shipping_address || locationsResponse.data.data;
        console.log("Available pickup locations:", locations);

        if (locations && locations.length > 0) {
            // Use the first available pickup location
            const firstLocation = locations[0];
            orderData.pickup_location = firstLocation.pickup_location || firstLocation.nickname || firstLocation.address || firstLocation.city;
            console.log("Selected pickup location:", orderData.pickup_location);
        } else {
            console.warn("No pickup locations found in response");
            // Don't set a default - let Shiprocket handle it or fail gracefully
            delete orderData.pickup_location;
        }
    } catch (error: any) {
        console.warn("Failed to fetch pickup locations:", error?.response?.status || error.message);
        console.warn("Pickup location error details:", error?.response?.data);

        // If we get the "Wrong Pickup location" error, it means locations exist but we're using wrong name
        // In this case, we should not set any pickup_location and let the API handle it
        if (error?.response?.data?.message?.includes("Wrong Pickup location")) {
            console.log("Pickup location validation failed, removing pickup_location from order");
            delete orderData.pickup_location;
        } else {
            // For other errors, don't set pickup location
            delete orderData.pickup_location;
        }
    }

    console.log(orderData);

    const passedData = ShipRocketOrderSchema.safeParse(orderData);
    if (!passedData.success) {
        console.error("Validation errors:", passedData.error.errors);
        console.error("Order data being validated:", orderData);
        throw new RouteError(HttpStatusCodes.BAD_REQUEST, "Invalid data: " + passedData.error.errors.map(e => e.message).join(", "));
    }

    // Ensure unique SKUs for Shiprocket order items
    const uniqueSkus = new Set<string>();
    orderData.order_items = orderData.order_items.map((item: any, index: number) => {
        let sku = item.sku;
        let counter = 1;
        while (uniqueSkus.has(sku)) {
            sku = `${item.sku}_${counter}`;
            counter++;
        }
        uniqueSkus.add(sku);
        return { ...item, sku };
    });

    try {
        const response = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
            orderData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${shipToken}`,
                }
            }
        );
        console.log(response.data);

        const ShipRocketOrderId = response.data.order_id;
        await prisma.$transaction([
            prisma.order.update({
                where: {
                    id: orderData.order_id
                },
                data: {
                    ShipRocketOrderId: ShipRocketOrderId
                }
            })
        ]);

        res.status(HttpStatusCodes.CREATED).json({ success: true, data: response.data });

    } catch (error: any) {
        console.error("Shiprocket Create Order Error:", error);

        // Handle specific Shiprocket errors
        if (error.response?.status === 400) {
            const errorMessage = error.response?.data?.message || "Bad request to Shiprocket";
            console.error("Shiprocket 400 Error:", errorMessage);

            // If it's about pickup location or address, provide helpful guidance
            if (errorMessage.includes("billing/shipping address") || errorMessage.includes("pickup")) {
                res.status(HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: "Shiprocket Configuration Required",
                    message: "Please configure your pickup location and billing/shipping address in your Shiprocket dashboard first.",
                    details: errorMessage
                });
                return;
            }

            res.status(HttpStatusCodes.BAD_REQUEST).json({
                success: false,
                error: "Order Creation Failed",
                message: errorMessage
            });
            return;
        }

        // For other errors, still save the order but mark it as failed
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: "Failed to create Shiprocket order",
            message: error.response?.data?.message || error.message
        });
    }

};

const cancelShiprocketOrder: RequestHandler = async (req, res, next) => {
    const shipToken = await getShiprocketToken();
    if (!shipToken) {
        throw new RouteError(HttpStatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const orderId = req.body.orderId;

    try {

        const orderData = await prisma.order.findUnique({
            where: {
                id: orderId
            }
        });

        console.log(orderData);

        const response = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/orders/cancel",
            { ids: [orderData?.ShipRocketOrderId] },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${shipToken}`,
                }
            }
        );

        console.log(response.data);

        res.status(HttpStatusCodes.CREATED).json({ success: true, data: response.data });
    } catch (error) {
        console.error("Shiprocket Cancel Order Error:", error);
    }
};


const returnShiprocketOrder: RequestHandler = async (req, res, next) => {
    const shipToken = await getShiprocketToken();
    if (!shipToken) {
        throw new RouteError(HttpStatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const orderId = req.body.orderId;
    const reason = req.body.reason;
    const additionalInfo = req.body.additionalInfo;

    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            items: true
        }
    });

    const getOrderDetails = await axios.get(`https://apiv2.shiprocket.in/v1/external/orders/show/` + order?.ShipRocketOrderId, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${shipToken}`,
        }
    })


    const oData = getOrderDetails.data;
    const orderData = {
        "order_id": oData.data.id,
        "order_date": order?.createdAt.toISOString().split('T')[0],
        "pickup_customer_name": oData.data.customer_name, 
        "pickup_address": oData.data.customer_address,
        "pickup_city": oData.data.customer_city,
        "pickup_state": oData.data.customer_state,
        "pickup_country": oData.data.customer_country,
        "pickup_pincode": oData.data.customer_pincode,
        "pickup_email": oData.data.customer_email,
        "pickup_phone": oData.data.customer_phone,
        "shipping_customer_name": "Kartik ",
        "shipping_address": oData.data.pickup_location,
        "shipping_city": "Gautam Buddha Nagar",
        "shipping_country": "India",
        "shipping_pincode": "201301",
        "shipping_state": "Uttar Pradesh",
        "shipping_phone": "7428637234",
        "order_items": order?.items.map((item) => ({
            "name": item.productName,
            "sku": "ARV" + item.color + item.size,
            "units": item.quantity,
            "selling_price": item.priceAtOrder
        })),
        "payment_method": order?.paid ? "cod" : "Prepaid",
        "sub_total": order?.total,
        "length": oData.data.shipments.length,
        "breadth": oData.data.shipments.breadth,
        "height": oData.data.shipments.height,
        "weight": oData.data.shipments.weight,
    };
    console.log(orderData);
    try {
        const response = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/orders/create/return",
            orderData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${shipToken}`,
                }
            }
        );
        console.log(response.data);

        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                returnReason: reason,
                returnAdditionalInfo: additionalInfo,
                fulfillment: OrderFulfillment.RETURNING,
            }
        });

        res.status(HttpStatusCodes.CREATED).json({ success: true, data: response.data });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Shiprocket Return Order Error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            console.error("Shiprocket Return Order Error:", error.response?.data.errors);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: error.response?.data?.message || error.message || "Failed to return order"
            });
        } else {
            console.error("Shiprocket Return Order Error:", error);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to return order"
            });
        }
    }
};

const getShiprocketPickupLocations: RequestHandler = async (req, res, next) => {
    const shipToken = await getShiprocketToken();
    if (!shipToken) {
        throw new RouteError(HttpStatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    try {
        const response = await axios.get(
            "https://apiv2.shiprocket.in/v1/external/settings/company/pickup",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${shipToken}`,
                }
            }
        );
        res.status(HttpStatusCodes.OK).json({ success: true, locations: response.data.data });
    } catch (error: any) {
        console.error("Shiprocket Pickup Locations Fetch Error:", error?.response?.status || error.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch pickup locations",
            details: error?.response?.data?.message || error.message
        });
    }
};

export default {
    createShiprocketOrder,
    cancelShiprocketOrder,
    returnShiprocketOrder,
    getShiprocketPickupLocations
};
