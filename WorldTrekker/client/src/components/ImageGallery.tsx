import React from 'react';
import { UnsplashImage } from '../types/country';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageGalleryProps {
  images: UnsplashImage[];
  isLoading: boolean;
  error: Error | null;
  title: string;
  icon: React.ReactNode;
  gridCols?: string;
  description?: string;
  isDescriptionLoading?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  isLoading,
  error,
  title,
  icon,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  description,
  isDescriptionLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          {icon}
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
        </div>
        <div className={`grid ${gridCols} gap-4`}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          {icon}
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Unable to load images</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center mb-3">
          {icon}
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
        </div>
        {/* AI-Generated Description */}
        {isDescriptionLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : description && (
          <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200">
            {description}
          </p>
        )}
      </div>
      
      <div className={`grid ${gridCols} gap-4`}>
        {images.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-lg">
            <img 
              src={image.urls.regular} 
              alt={image.alt_description || 'Country image'}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white font-medium text-sm text-center px-2">
                {image.alt_description || 'Explore'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
