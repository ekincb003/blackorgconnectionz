'use client';

import React, { useRef, useState } from 'react';
import { Upload, Camera, Loader2, Check, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '../lib/imageUtils';
import { uploadImageToSupabase } from '../lib/supabaseClient';

interface ImageUploadButtonProps {
  label?: string;
  className?: string;
  imageType?: 'avatar' | 'banner' | 'general';
  onImageUploaded: (dataUrl: string) => void;
}

export default function ImageUploadButton({
  label = 'Upload from Files / Photos',
  className = '',
  imageType = 'avatar',
  onImageUploaded
}: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);

      // 1. Try uploading to Supabase Cloud Storage (Platform Media Bucket)
      const cloudUrl = await uploadImageToSupabase(file, imageType);
      if (cloudUrl) {
        onImageUploaded(cloudUrl);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2500);
        return;
      }

      // 2. Fallback to optimized compressed Data URL
      const maxWidth = imageType === 'banner' ? 1600 : imageType === 'avatar' ? 600 : 1200;
      const maxHeight = imageType === 'banner' ? 800 : imageType === 'avatar' ? 600 : 900;

      const compressedDataUrl = await compressImageFile(file, {
        maxWidth,
        maxHeight,
        quality: 0.85
      });

      onImageUploaded(compressedDataUrl);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err) {
      console.error('Error reading/compressing image:', err);
      alert('Could not process the selected image. Please try a different photo.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="inline-flex items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
          isSuccess
            ? 'bg-emerald-500 text-black shadow-md'
            : className || 'bg-white/10 hover:bg-gold-500 hover:text-black text-neutral-200 border border-white/10'
        }`}
        title="Upload from device storage, Photos, or Finder"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-3.5 h-3.5" /> Uploaded!
          </>
        ) : (
          <>
            <Upload className="w-3.5 h-3.5 text-gold-400" /> {label}
          </>
        )}
      </button>
    </div>
  );
}
