// First, fix the import path in DetailPropertyPage.tsx
"use client";
import usePropertyStore from "../../../store/PropertyStore"; // Fixed import path
import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square } from "lucide-react";
import InquiryDialog from "./InquiryDialog"; // Updated import name
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DetailPropertyPage({ id }: { id: string }) {
  const { isLoading, getPropertyById, error, property } = usePropertyStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getPropertyById(id);
    }
  }, [id, getPropertyById]);

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    
    return type === 'rent' ? `${formatted}/month` : formatted;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="text-slate-400 text-lg font-semibold mb-2">
            Not Found
          </div>
          <p className="text-slate-400">Property not found</p>
        </div>
      </div>
    );
  }

  const hasMultipleImages = property.images && property.images.length > 1;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="lg:w-3/5">
          <div className="relative group">
            {property.images && property.images.length > 0 ? (
              <>
                <div className="relative h-96 w-full rounded-lg overflow-hidden">
                  <Image
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {hasMultipleImages && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {property.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="lg:w-2/5 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">
                {property.type}
              </Badge>
              {property.createdAt && (
                <span className="text-sm text-gray-500">
                  Listed {new Date(property.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={16} className="mr-1" />
              <span>{property.location}</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {formatPrice(property.price, property.type)}
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Bed size={20} className="text-gray-600" />
              </div>
              <div className="text-sm text-gray-600">Bedrooms</div>
              <div className="font-semibold">{property.bedrooms}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Bath size={20} className="text-gray-600" />
              </div>
              <div className="text-sm text-gray-600">Bathrooms</div>
              <div className="font-semibold">{property.bathrooms}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Square size={20} className="text-gray-600" />
              </div>
              <div className="text-sm text-gray-600">Area</div>
              <div className="font-semibold">{property.area} sq ft</div>
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {/* Inquiry Dialog Button */}
            <InquiryDialog propertyId={property._id} />
            
     
            
          </div>
        </div>
      </div>
    </div>
  );
}