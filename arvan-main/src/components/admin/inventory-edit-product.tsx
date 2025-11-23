"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Minus, X, Upload } from "lucide-react";
import Link from "next/link";
import { productApi } from "@/lib/api/productdetails";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Products } from "./products-table";
import UploadPopup from "../UploadPopup";
import { inventoryApi } from "@/lib/api/inventory";
import Image from "next/image";

// Define types based on the provided JSON structure
interface Size {
  id: string;
  size: string;
  stock: number;
  colorId: string;
}

// Available sizes for selection
const availableSizes = [
  "SIZE_6",
  "SIZE_7",
  "SIZE_8",
  "SIZE_9",
  "SIZE_10",
  "SIZE_11",
  "SIZE_12",
  "SIZE_13",
];

export function ProductInventoryEditor({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Products | null>(null);
  const [saving, setSaving] = useState(false);
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddColorForm, setShowAddColorForm] = useState(false);
  const [newColor, setNewColor] = useState({ name: "", imageUrl: "" });
  const [newColors, setNewColors] = useState<
    Array<{
      name: string;
      imageUrl: string;
      sizes: Array<{ size: string; stock: number }>;
    }>
  >([]);
  const [showAddSizeForm, setShowAddSizeForm] = useState<string | null>(null);
  const [newSize, setNewSize] = useState({ size: "", stock: 0 });
  const [newSizes, setNewSizes] = useState<
    Record<string, Array<{ size: string; stock: number }>>
  >({});
  const [Uploadz, setUpload] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productApi.getById(productId as string),
    enabled: !!productId,
  });

  // In a real application, this would fetch the product data from an API
  useEffect(() => {
    // Simulate API call
    if (data) {
      setProduct(data);
    }
  }, [data]);

  const formatSizeName = (sizeName: string) => {
    return sizeName.replace("SIZE_", "Size ").replace("_", ".");
  };

  const handleStockChange = (sizeId: string, newStock: number) => {
    if (newStock < 0) newStock = 0;
    setStockUpdates({
      ...stockUpdates,
      [sizeId]: newStock,
    });
  };

  const getStockValue = (size: Size) => {
    return stockUpdates[size.id] !== undefined
      ? stockUpdates[size.id]
      : size.stock;
  };

  const handleAddColor = () => {
    if (!newColor.name.trim()) {
      alert("Please enter a color name");
      return;
    }

    setNewColors([...newColors, { ...newColor, sizes: [] }]);
    setNewColor({ name: "", imageUrl: "" });
    setShowAddColorForm(false);
  };

  const handleAddSize = (colorId: string) => {
    if (!newSize.size) {
      alert("Please select a size");
      return;
    }

    // For existing colors
    if (product?.colors.find((c) => c.id === colorId)) {
      const updatedSizes = [...(newSizes[colorId] || []), { ...newSize }];
      setNewSizes({
        ...newSizes,
        [colorId]: updatedSizes,
      });
    }
    // For new colors
    else {
      const colorIndex = newColors.findIndex((c) => c.name === colorId);
      if (colorIndex !== -1) {
        const updatedNewColors = [...newColors];
        updatedNewColors[colorIndex].sizes.push({ ...newSize });
        setNewColors(updatedNewColors);
      }
    }

    setNewSize({ size: "", stock: 0 });
    setShowAddSizeForm(null);
  };

  const handleRemoveNewColor = (index: number) => {
    const updatedNewColors = [...newColors];
    updatedNewColors.splice(index, 1);
    setNewColors(updatedNewColors);
  };

  const handleRemoveNewSize = (colorId: string, sizeIndex: number) => {
    // For existing colors
    if (product?.colors.find((c) => c.id === colorId)) {
      const updatedSizes = [...(newSizes[colorId] || [])];
      updatedSizes.splice(sizeIndex, 1);
      setNewSizes({
        ...newSizes,
        [colorId]: updatedSizes,
      });
    }
    // For new colors
    else {
      const colorIndex = newColors.findIndex((c) => c.name === colorId);
      if (colorIndex !== -1) {
        const updatedNewColors = [...newColors];
        updatedNewColors[colorIndex].sizes.splice(sizeIndex, 1);
        setNewColors(updatedNewColors);
      }
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    // In a real implementation, this would open a file picker and upload the image
    setNewColor({ ...newColor, imageUrl });
    setUpload(false);
  };

  const mutation = useMutation({
    mutationFn: async (updates: Record<string, number>) => {
      const promises = Object.entries(updates).map(([variantId, stock]) =>
        inventoryApi.updateStock(variantId, stock)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setSaving(false);
    },
    onError: (error) => {
      console.error("Failed to update stock:", error);
      setSaving(false);
    },
  });

  const NewSizeMutation = useMutation({
    mutationFn: async (
      updates: Record<string, Array<{ size: string; stock: number }>>
    ) => {
      const promises = Object.entries(updates).map(([colorId, sizes]) =>
        inventoryApi.addNewSize(colorId, sizes)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setSaving(false);
    },
    onError: (error) => {
      console.error("Failed to update stock:", error);
      setSaving(false);
    },
  });

  const NewColorMutation = useMutation({
    mutationFn: async (
      newColors: Array<{
        name: string;
        imageUrl: string;
        sizes: Array<{ size: string; stock: number }>;
      }>
    ) => {
      const promises = newColors.map((newColorData) =>
        inventoryApi.addNewColor(productId, newColorData)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setSaving(false);
    },
    onError: (error) => {
      console.error("Failed to update stock:", error);
      setSaving(false);
    },
  });

  const handleSave = async () => {
    setSaving(true);

    // Update the local product data with the new stock values
    if (product) {
      try {
        await mutation.mutateAsync(stockUpdates);
      } catch (error) {
        console.error("Failed to update stock:", error);
        setSaving(false);
        return;
      }

      try {
        await NewSizeMutation.mutateAsync(newSizes);
      } catch (error) {
        console.error("Failed to update stock:", error);
        setSaving(false);
        return;
      }

      // Add new colors with their sizes
      try {
        await NewColorMutation.mutateAsync(newColors);
      } catch (error) {
        console.error("Failed to update stock:", error);
        setSaving(false);
        return;
      }
    }

    setSuccessMessage("Inventory updated successfully!");
    setSaving(false);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    // Clear all updates since they're now applied
    setStockUpdates({});
    setNewColors([]);
    setNewSizes({});
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#4f507f] mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading product inventory...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
        <p className="text-red-500 text-sm sm:text-base">Product not found</p>
        <Link
          href="/admin/products/inventory"
          className="text-[#4f507f] hover:underline mt-3 sm:mt-4 inline-block text-sm sm:text-base">
          Back to Inventory
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
        <p className="text-red-500 text-sm sm:text-base">Error loading product inventory</p>
        <Link
          href="/admin/products/inventory"
          className="text-[#4f507f] hover:underline mt-3 sm:mt-4 inline-block text-sm sm:text-base">
          Back to Inventory
        </Link>
      </div>
    );
  }

  const hasChanges =
    Object.keys(stockUpdates).length > 0 ||
    newColors.length > 0 ||
    Object.values(newSizes).some((sizes) => sizes.length > 0);

  // Get available sizes that aren't already used for a specific color
  const getAvailableSizesForColor = (colorId: string) => {
    const existingColor = product?.colors.find((c) => c.id === colorId);
    const existingSizes = existingColor
      ? existingColor.sizes.map((s) => s.size)
      : [];
    const newSizesForColor = newSizes[colorId]
      ? newSizes[colorId].map((s) => s.size)
      : [];
    const usedSizes = [...existingSizes, ...newSizesForColor];
    return availableSizes.filter((size) => !usedSizes.includes(size));
  };

  // Get available sizes for a new color
  const getAvailableSizesForNewColor = (colorName: string) => {
    const newColorData = newColors.find((c) => c.name === colorName);
    const usedSizes = newColorData ? newColorData.sizes.map((s) => s.size) : [];
    return availableSizes.filter((size) => !usedSizes.includes(size));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center">
            <Link
              href="/admin/products/inventory"
              className="mr-2 sm:mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-1">
                {product?.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">ID: {product?.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
            {successMessage && (
              <span className="text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
                {successMessage}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm ${
                hasChanges && !saving
                  ? "bg-[#4f507f] text-white hover:bg-[#3e3f63]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}>
              <Save size={14} className="sm:size-8" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="p-3 sm:p-4 md:p-6">
        {/* Add New Color Button */}
        {!showAddColorForm && (
          <button
            onClick={() => setShowAddColorForm(true)}
            className="mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm">
            <Plus size={14} className="sm:size-8" />
            <span>Add New Color</span>
          </button>
        )}

        {/* Add New Color Form */}
        {showAddColorForm && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 border border-gray-200 rounded-lg">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Add New Color</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Color Name
                </label>
                <input
                  type="text"
                  value={newColor.name}
                  onChange={(e) =>
                    setNewColor({ ...newColor, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f] text-sm"
                  placeholder="e.g., Red, Blue, Green"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Color Image
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  {newColor.imageUrl !== "" ? (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 border border-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        width={100}
                        height={100}
                        src={newColor.imageUrl || "/logo.svg"}
                        alt="Color"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setUpload(true)}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center text-xs sm:text-sm">
                    <Upload size={14} className="sm:size-5 mr-1 sm:mr-2" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button
                type="button"
                onClick={() => setShowAddColorForm(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-xs sm:text-sm">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4f507f] text-white rounded-md hover:bg-[#3e3f63] text-xs sm:text-sm">
                Add Color
              </button>
            </div>
          </div>
        )}

        {/* New Colors */}
        {newColors.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">New Colors</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {newColors.map((newColorData, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {newColorData.imageUrl !== "" ? (
                        <div className="w-8 h-8 sm:w-12 sm:h-12 overflow-hidden flex-shrink-0">
                          <Image
                            width={100}
                            height={100}
                            src={newColorData.imageUrl}
                            alt="Color"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                          {newColorData.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {newColorData.sizes.length} size variants
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveNewColor(index)}
                      className="text-red-600 hover:text-red-800 p-1 sm:p-2">
                      <X size={16} className="sm:size-18" />
                    </button>
                  </div>
                  <div className="p-3 sm:p-4">
                    {newColorData.sizes.length > 0 ? (
                      <div className="overflow-x-auto -mx-3">
                        <table className="min-w-full">
                          <thead>
                            <tr>
                              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">
                                Size
                              </th>
                              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">
                                Stock
                              </th>
                              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {newColorData.sizes.map((sizeData, sizeIndex) => (
                              <tr key={sizeIndex}>
                                <td className="py-2 px-3 text-xs sm:text-sm font-medium text-gray-900">
                                  {formatSizeName(sizeData.size)}
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="number"
                                    min="0"
                                    value={sizeData.stock}
                                    onChange={(e) => {
                                      const updatedNewColors = [...newColors];
                                      updatedNewColors[index].sizes[
                                        sizeIndex
                                      ].stock =
                                        Number.parseInt(e.target.value) || 0;
                                      setNewColors(updatedNewColors);
                                    }}
                                    className="w-16 sm:w-20 px-2 bg-white py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f] text-xs sm:text-sm"
                                  />
                                </td>
                                <td className="py-2 px-3 text-right">
                                  <button
                                    onClick={() =>
                                      handleRemoveNewSize(
                                        newColorData.name,
                                        sizeIndex
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800 p-1">
                                    <X size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-3 sm:py-4 text-xs sm:text-sm">
                        No sizes added yet
                      </p>
                    )}

                    {showAddSizeForm === newColorData.name ? (
                      <div className="mt-3 sm:mt-4 p-2 sm:p-3 border border-gray-200 rounded-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Size
                            </label>
                            <select
                              value={newSize.size}
                              onChange={(e) =>
                                setNewSize({ ...newSize, size: e.target.value })
                              }
                              className="w-full px-2 sm:px-3 bg-white py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f] text-xs sm:text-sm">
                              <option value="">Select Size</option>
                              {getAvailableSizesForNewColor(
                                newColorData.name
                              ).map((size) => (
                                <option key={size} value={size}>
                                  {formatSizeName(size)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Stock
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={newSize.stock}
                              onChange={(e) =>
                                setNewSize({
                                  ...newSize,
                                  stock: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f] text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2 sm:mt-3">
                          <button
                            type="button"
                            onClick={() => setShowAddSizeForm(null)}
                            className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-xs">
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddSize(newColorData.name)}
                            className="px-2 sm:px-3 py-1 bg-[#4f507f] text-white rounded-md hover:bg-[#3e3f63] text-xs">
                            Add Size
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowAddSizeForm(newColorData.name);
                          setNewSize({ size: "", stock: 0 });
                        }}
                        className="mt-3 sm:mt-4 w-full flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 text-xs sm:text-sm">
                        <Plus size={14} className="sm:size-16" />
                        <span>Add Size</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Colors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {product?.colors.map((color) => (
            <div
              key={color.id}
              className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 sm:p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  {color.assets.length > 0 && (
                    <Image
                      width={100}
                      height={100}
                      src={color.assets[0].asset_url || "/placeholder.svg"}
                      alt={color.color}
                      className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-md flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{color.color}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {color.sizes.length + (newSizes[color.id]?.length || 0)}{" "}
                      size variants
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <div className="overflow-x-auto -mx-3">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">
                          Size
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">
                          Stock
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Existing sizes */}
                      {color.sizes.map((size) => (
                        <tr key={size.id}>
                          <td className="py-2 px-3 text-xs sm:text-sm font-medium text-gray-900">
                            {formatSizeName(size.size)}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0"
                              value={getStockValue(size)}
                              onChange={(e) =>
                                handleStockChange(
                                  size.id,
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 sm:w-20 px-2 py-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f] text-xs sm:text-sm"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <button
                                onClick={() =>
                                  handleStockChange(
                                    size.id,
                                    getStockValue(size) - 1
                                  )
                                }
                                className="p-1 rounded-md hover:bg-gray-100"
                                disabled={getStockValue(size) <= 0}>
                                <Minus
                                  size={14}
                                  className={
                                    getStockValue(size) <= 0
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handleStockChange(
                                    size.id,
                                    getStockValue(size) + 1
                                  )
                                }
                                className="p-1 rounded-md hover:bg-gray-100">
                                <Plus size={14} className="text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* New sizes for existing colors */}
                      {newSizes[color.id]?.map((sizeData, sizeIndex) => (
                        <tr key={`new-${sizeIndex}`}>
                          <td className="py-2 px-3 text-xs sm:text-sm font-medium text-gray-900">
                            {formatSizeName(sizeData.size)}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0"
                              value={sizeData.stock}
                              onChange={(e) => {
                                const updatedSizes = [...newSizes[color.id]];
                                updatedSizes[sizeIndex].stock =
                                  Number.parseInt(e.target.value) || 0;
                                setNewSizes({
                                  ...newSizes,
                                  [color.id]: updatedSizes,
                                });
                              }}
                              className="w-16 sm:w-20 px-2 py-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f] text-xs sm:text-sm"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() =>
                                handleRemoveNewSize(color.id, sizeIndex)
                              }
                              className="text-red-600 hover:text-red-800 p-1">
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add new size form for existing color */}
                {showAddSizeForm === color.id ? (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Size
                        </label>
                        <select
                          value={newSize.size}
                          onChange={(e) =>
                            setNewSize({ ...newSize, size: e.target.value })
                          }
                          className="w-full px-2 sm:px-3 bg-white py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f] text-xs sm:text-sm">
                          <option value="">Select Size</option>
                          {getAvailableSizesForColor(color.id).map((size) => (
                            <option key={size} value={size}>
                              {formatSizeName(size)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newSize.stock}
                          onChange={(e) =>
                            setNewSize({
                              ...newSize,
                              stock: Number.parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f] text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2 sm:mt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddSizeForm(null)}
                        className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-xs">
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddSize(color.id)}
                        className="px-2 sm:px-3 py-1 bg-[#4f507f] text-white rounded-md hover:bg-[#3e3f63] text-xs">
                        Add Size
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAddSizeForm(color.id);
                      setNewSize({ size: "", stock: 0 });
                    }}
                    className="mt-3 sm:mt-4 w-full flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 text-xs sm:text-sm">
                    <Plus size={14} className="sm:size-16" />
                    <span>Add Size</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {Uploadz && (
        <UploadPopup
          onSuccess={handleImageUpload}
          onClose={() => setUpload(false)}
        />
      )}
    </div>
  );
}