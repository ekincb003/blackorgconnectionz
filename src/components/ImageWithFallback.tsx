'use client';

import React, { useState } from 'react';
import { generateMonogramDataUrl } from '../lib/avatarGenerator';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'avatar' | 'banner' | 'logo' | 'photo';
  fallbackText?: string;
  fallbackBg?: string;
  fallbackTextColor?: string;
}

export const DEFAULT_CAMPUS_BANNER =
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80';

export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackType = 'avatar',
  fallbackText = 'BOC',
  fallbackBg = '#002B7F',
  fallbackTextColor = '#FFFFFF',
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const getFallbackSrc = () => {
    if (fallbackType === 'banner') {
      return DEFAULT_CAMPUS_BANNER;
    }
    // For avatar or logo, generate dynamic monogram
    return generateMonogramDataUrl({
      text: fallbackText || 'BOC',
      bgColor: fallbackBg,
      textColor: fallbackTextColor
    });
  };

  const imageSrc = !src || error ? getFallbackSrc() : src;

  return (
    <img
      src={imageSrc}
      alt={alt || ''}
      className={className}
      onError={() => {
        if (!error) setError(true);
      }}
      {...props}
    />
  );
}
