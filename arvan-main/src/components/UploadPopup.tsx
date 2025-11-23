'use client'

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import { Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UploadPopupProps {
  onSuccess: (url: string) => void
  onClose: () => void
}

export default function UploadPopup({ onSuccess, onClose }: UploadPopupProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false) // New state for processing indication

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setProgress(0) // Reset progress when a new file is added
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return alert("Please select a file")

    setUploading(true)
    setProcessing(false) // Reset processing state
    setProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            setProgress(percent)

            // When upload reaches 100%, start processing state
            if (percent === 100) {
              setProcessing(true)
            }
          }
        },
      })

      setProcessing(false) // Stop processing when upload completes
      onSuccess(response.data.url)
    } catch (error) {
      console.error(error)
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Upload File</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          {file ? (
            <p className="mt-2 text-sm text-gray-600">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          ) : isDragActive ? (
            <p className="mt-2 text-sm text-gray-600">Drop the file here ...</p>
          ) : (
            <p className="mt-2 text-sm text-gray-600">Drag & drop a file here, or click to select</p>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          Make sure to upload high-quality images or videos for the best results.
        </p>
        {uploading && (
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-xs mt-1">
              {progress}% ({((file?.size || 0) * (progress / 100) / 1024 / 1024).toFixed(2)} MB uploaded)
            </p>
            {processing && <p className="text-center text-sm text-blue-600 mt-2">Processing...</p>}
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  )
}
