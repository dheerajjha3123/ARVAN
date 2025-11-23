"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Upload, X, Trash2, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FileWithPreview extends File {
  preview: string;
}

interface MultiUploadPopupProps {
  onSuccess: (urls: string[]) => void;
  onClose: () => void;
}

export default function MediaManager({
  onSuccess,
  onClose,
}: MultiUploadPopupProps) {
  const [showUpload, setShowUpload] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<string[]>([]);
  const [previousUploads, setPreviousUploads] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setFiles((prev) => [...prev, ...filesWithPreview]);
    setProgress((prev) => [
      ...prev,
      ...new Array(acceptedFiles.length).fill(0),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    multiple: true,
  });

  const fetchPreviousUploads = async (initial = false) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/previous`,
        {
          params: { limit: 20, cursor: initial ? null : cursor },
        }
      );
      const { uploads, nextCursor } = res.data;
      setPreviousUploads((prev) => [
        ...prev,
        ...uploads.map((u: { url: string }) => u.url),
      ]);
      setCursor(nextCursor);
    } catch (err) {
      console.error("Gallery fetch failed", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (showGallery) {
      setPreviousUploads([]);
      setCursor(null);
      fetchPreviousUploads(true);
    }
  }, [showGallery]);

  useEffect(() => {
    const div = galleryRef.current;
    if (!div) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = div;
      if (scrollTop / (scrollHeight - clientHeight) > 0.8 && cursor) {
        fetchPreviousUploads();
      }
    };
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [cursor]);

  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select files");
    setUploading(true);
    setProcessing(false);
    setProgress(new Array(files.length).fill(0));

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/multiple`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) {
              const percent = Math.round((e.loaded / e.total) * 100);
              setProgress((prev) => prev.map(() => percent));
              if (percent === 100) setProcessing(true);
            }
          },
        }
      );
      setProcessing(false);
      onSuccess(res.data.urls);
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (i: number) => {
    URL.revokeObjectURL(files[i].preview);
    setFiles(files.filter((_, idx) => idx !== i));
    setProgress(progress.filter((_, idx) => idx !== i));
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-semibold">Media Manager</h2>
          <div className="flex p-4 bg-gray-100 rounded-lg">
            <Button
              className={`flex-1 py-2.5 px-6 rounded-lg transition-all font-medium ${
                showUpload
                  ? "bg-[#4f507f] hover:bg-[#4f507f] text-white shadow-sm"
                  : "bg-transparent hover:bg-transparent text-gray-600"
              }`}
              onClick={() => {
                setShowUpload(true);
                setShowGallery(false);
              }}>
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </Button>

            <Button
              className={`flex-1 py-2.5 px-6 rounded-lg transition-all font-medium ${
                showGallery
                  ? "bg-[#4f507f] hover:bg-[#4f507f] text-white shadow-sm"
                  : "bg-transparent hover:bg-transparent text-gray-600"
              }`}
              onClick={() => {
                setShowGallery(true);
                setShowUpload(false);
              }}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Select from Gallery
            </Button>
          </div>{" "}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-gray-100 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 overflow-hidden flex-1 ">
          {showUpload && (
            <>
              {files.length === 0 ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-[#4f507f] bg-[#4f507f]/10"
                      : "border-gray-300 hover:border-[#4f507f] hover:bg-gray-50"
                  }`}>
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
                  <p className="text-sm text-gray-600">
                    Drag & drop or click to select files
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Selected Files</p>
                    <div className="flex gap-2">
                      <Badge>{files.length} selected</Badge>
                      <Button
                        size="sm"
                        className="bg-[#4f507f] text-white hover:bg-[#3e3f63]"
                        {...getRootProps()}>
                        Add More
                        <input {...getInputProps()} />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="relative group border rounded-lg overflow-hidden shadow-sm">
                        <div className="aspect-square relative">
                          {isImage(file) ? (
                            <Image
                              src={file.preview}
                              alt={file.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs">
                              {file.type.split("/")[1].toUpperCase()}
                            </div>
                          )}
                          {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-full px-2">
                                <div className="bg-white/30 h-1 rounded-full">
                                  <div
                                    className="bg-white h-full"
                                    style={{ width: `${progress[i]}%` }}
                                  />
                                </div>
                                <p className="text-white text-[10px] mt-0.5 text-center">
                                  {progress[i]}%
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-1 text-[10px] text-gray-700 truncate">
                          {file.name}
                        </div>
                        {!uploading && (
                          <button
                            onClick={() => removeFile(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {processing && (
                <div className="text-center mt-4 text-sm text-[#4f507f]">
                  Processing files...
                </div>
              )}
            </>
          )}

          {showGallery && (
            <div
              ref={galleryRef}
              className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {previousUploads.map((url, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setSelectedGallery((prev) =>
                      prev.includes(url)
                        ? prev.filter((u) => u !== url)
                        : [...prev, url]
                    )
                  }
                  className={`relative border-2 ${
                    selectedGallery.includes(url)
                      ? "border-[#4f507f]"
                      : "border-transparent"
                  } rounded-lg overflow-hidden cursor-pointer`}>
                  <Image
                    src={url}
                    alt="upload"
                    width={300}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover w-full h-full"
                  />
                  {selectedGallery.includes(url) && (
                    <div className="absolute top-1 right-1 bg-[#4f507f] text-white text-xs rounded-full px-2 py-0.5">
                      ✓
                    </div>
                  )}
                </div>
              ))}
              {loadingMore && (
                <p className="col-span-3 text-center text-sm text-gray-500 py-2">
                  Loading more...
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50">
          <Button
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
            disabled={uploading}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#4f507f] text-white py-2 px-4 rounded-md hover:bg-[#3e3f63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={
              showUpload ? handleUpload : () => onSuccess(selectedGallery)
            }
            disabled={
              (showUpload && files.length === 0) ||
              (showGallery && selectedGallery.length === 0) ||
              uploading
            }>
            {showUpload
              ? uploading
                ? "Uploading..."
                : "Upload"
              : "Use Selected"}
          </Button>
        </div>
      </div>
    </div>
  );
}
