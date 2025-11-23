"use client";
import React, { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";

interface ReturnReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, additionalInfo: string) => Promise<void>;
}

const ReturnReasonModal: React.FC<ReturnReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const returnReasons = [
    "Wrong size or fit",
    "Item is damaged",
    "Quality not as expected",
    "Wrong item received",
    "Not as described",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError("Please select a reason for return");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(selectedReason, additionalInfo);
      onClose();
    } catch (err) {
        console.error("Failed to submit return request:", err);
      setError("Failed to submit return request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-gray-700 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-medium">Return Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Why are you returning this order?*
            </label>
            <div className="space-y-2">
              {returnReasons.map((reason) => (
                <div key={reason} className="flex items-center">
                  <input
                    type="radio"
                    id={reason}
                    name="returnReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="mr-2 accent-[#C2E53A]"
                  />
                  <label htmlFor={reason} className="text-gray-300">
                    {reason}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Additional Information (optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 rounded-sm p-3 text-white focus:outline-none focus:border-[#C2E53A]"
              rows={4}
              placeholder="Please provide any additional details about your return..."
            />
          </div>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-sm hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-[#C2E53A] text-black px-4 py-2 rounded-sm hover:bg-[#a8c72f] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Return"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnReasonModal;
