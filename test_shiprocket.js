import axios from 'axios';

// Test Shiprocket API endpoints
async function testShiprocketAPI() {
    try {
        console.log('Testing Shiprocket API...');

        // First, get token
        console.log('1. Getting authentication token...');
        const authResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: "arvansite77@gmail.com",
            password: "m%$!SF5lmDNWpB0j"
        });

        const token = authResponse.data.token;
        console.log('Token obtained:', token ? 'Yes' : 'No');

        if (!token) {
            console.error('No token received');
            return;
        }

        // Test pickup locations endpoint
        console.log('2. Testing pickup locations endpoint...');
        try {
            const locationsResponse = await axios.get('https://apiv2.shiprocket.in/v1/external/settings/company/locations', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Pickup locations success:', locationsResponse.data);
        } catch (error) {
            console.error('Pickup locations failed:', error.response?.status, error.response?.data);
        }

        // Test order creation with sample data
        console.log('3. Testing order creation...');
        const sampleOrder = {
            "order_id": "TEST123",
            "order_date": new Date().toISOString().split('T')[0],
            "pickup_location": "Primary",
            "billing_customer_name": "Test User",
            "billing_address": "Test Address",
            "billing_city": "Test City",
            "billing_pincode": "110001",
            "billing_state": "Delhi",
            "billing_country": "India",
            "billing_email": "test@example.com",
            "billing_phone": "9999999999",
            "shipping_is_billing": true,
            "order_items": [
                {
                    "name": "Test Product",
                    "sku": "TESTSKU",
                    "units": 1,
                    "selling_price": "100",
                    "hsn": "1234"
                }
            ],
            "payment_method": "COD",
            "sub_total": 100,
            "shipping_charges": 0,
            "giftwrap_charges": 0,
            "transaction_charges": 0,
            "total_discount": 0,
            "length": 10,
            "breadth": 10,
            "height": 10,
            "weight": 1
        };

        try {
            const orderResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', sampleOrder, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Order creation success:', orderResponse.data);
        } catch (error) {
            console.error('Order creation failed:', error.response?.status, error.response?.data);
        }

    } catch (error) {
        console.error('Auth failed:', error.response?.status, error.response?.data);
    }
}

testShiprocketAPI();
