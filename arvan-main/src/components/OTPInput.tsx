"use client";
import React, {
  useRef,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

type OTPInputProps = {
  otp: string[];
  onChangeOtp: (otp: string[]) => void;
};

const OTPInput: React.FC<OTPInputProps> = ({ otp, onChangeOtp }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    onChangeOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1]?.focus();
    }
  };

  

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, otp.length);

    if (!/^\\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i >= otp.length) break;
      newOtp[i] = pasteData[i];
    }
    onChangeOtp(newOtp);

    // Focus the next empty input or the last input
    const focusIndex = Math.min(pasteData.length, otp.length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 sm:w-14 sm:h-14 text-2xl font-bold bg-transparent
                      border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49] text-center 
                      rounded-md outline-none focus:ring-2 focus:ring-lime-500"
            autoComplete="off"
          />
        ))}
      </div>
    </div>
  );
};

export default OTPInput;
