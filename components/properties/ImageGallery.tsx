'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Heart,
  Share2,
  Play,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  X,
} from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
  videoUrl?: string;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
}

export function ImageGallery({ 
  images, 
  title, 
  videoUrl, 
  onFavoriteToggle, 
  isFavorite 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  return (
    <>
      {/* Main Gallery Layout */}
      <div className="grid grid-cols-4 gap-2 h-96 lg:h-[500px]">
        {/* Main Image */}
        <div className="col-span-4 lg:col-span-2 relative group">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover rounded-l-lg lg:rounded-lg cursor-pointer"
            onClick={() => setIsGalleryOpen(true)}
          />
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/80 hover:bg-background backdrop-blur-sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/80 hover:bg-background backdrop-blur-sm"
              onClick={onFavoriteToggle}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          {/* Video Play Button */}
          {videoUrl && (
            <Button
              variant="ghost"
              size="lg"
              className="absolute inset-0 w-full h-full bg-black/20 hover:bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowVideo(true)}
            >
              <div className="flex flex-col items-center text-white">
                <Play className="h-12 w-12 mb-2" />
                <span className="text-sm font-medium">Ver Vídeo</span>
              </div>
            </Button>
          )}

          {/* Gallery Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-4 right-4 bg-background/80 hover:bg-background backdrop-blur-sm"
            onClick={() => setIsGalleryOpen(true)}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Ver todas as fotos
          </Button>
        </div>

        {/* Thumbnail Grid */}
        <div className="col-span-4 lg:col-span-2 grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <div key={index + 1} className="relative group">
              <img
                src={image}
                alt={`${title} ${index + 2}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  setSelectedImage(index + 1);
                  setIsGalleryOpen(true);
                }}
              />
              {index === 3 && images.length > 5 && (
                <div 
                  className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <span className="text-white font-semibold">
                    +{images.length - 5} fotos
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <DialogTitle className="sr-only">{title} - Galeria de Imagens</DialogTitle>
          <div className="relative w-full h-full bg-black">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {selectedImage + 1} / {images.length}
              </Badge>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt={`${title} ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer transition-opacity ${
                    selectedImage === index ? 'opacity-100 ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      {videoUrl && (
        <Dialog open={showVideo} onOpenChange={setShowVideo}>
          <DialogContent className="max-w-4xl w-full p-0">
            <DialogTitle className="sr-only">{title} - Player de Vídeo</DialogTitle>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setShowVideo(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {/* Video Player */}
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full"
                poster={images[0]}
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}