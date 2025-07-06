import { PropertyResponse } from "../../../../types/Property";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface PropertyCardProps {
  property: PropertyResponse;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/client/property/${property._id}`}>
      <Card className="w-80 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full group">
            <Image
              src={images[currentImageIndex] || "https://via.placeholder.com/400x250"}
              alt={property.title}
              fill
              className="object-cover rounded-t-2xl"
            />
            
            {/* Image Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Property Type Badge */}
            <Badge variant="secondary" className="absolute top-2 left-2 capitalize">
              {property.type}
            </Badge>

            {/* Image Count Badge */}
            {hasMultipleImages && (
              <Badge variant="outline" className="absolute top-2 right-2 bg-black/50 text-white border-white/50">
                {currentImageIndex + 1}/{images.length}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-lg font-semibold line-clamp-2 flex-1 mr-2">
              {property.title}
            </CardTitle>
          </div>

          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium line-clamp-1 text-right">
                {property.location}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bedrooms:</span>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex justify-between">
              <span>Bathrooms:</span>
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex justify-between">
              <span>Area:</span>
              <span className="font-medium">{property.area} sq ft</span>
            </div>
          </div>

          {/* Amenities Preview */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 2).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{property.amenities.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-primary">
              {formatPrice(property.price)}
            </p>
            <div className="text-xs text-gray-500 text-right">
              <div>{property.type}</div>
              {property.createdAt && (
                <div>
                  Listed: {new Date(property.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}