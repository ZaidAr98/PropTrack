"use client";
import React, { useEffect } from "react";
import UpdateImageForm from "./UpdateImageForm"; 
import MainForm from "../../../../add-property/components/MainForm";
import { FormProvider, useForm } from "react-hook-form";
import { AddPropertyRequest } from "@/types/Property";
import usePropertyStore from "../../../../../store/PropertyStore";

// Extended type for form state - matching backend expectations
type ExtendedPropertyInput = AddPropertyRequest & {
  images?: File[]; // New image files to upload
  existingImages?: string[]; // URLs of existing images to keep
};

const UpdatePropertyForm = ({ id }: { id: string }) => {
  const {
    isLoading,
    getPropertyById,
    updateProperty,
    isSubmitting,
    error,
    success,
    property,
  } = usePropertyStore();

  
  const formMethods = useForm<ExtendedPropertyInput>();
  const { handleSubmit, reset, setValue, watch } = formMethods;

  useEffect(() => {
    if (id) {
      getPropertyById(id);
    }
  }, [id, getPropertyById]);

  useEffect(() => {
    if (property && !isLoading) {
      const propertyData = {
        ...property,
        // Initialize with existing images
        existingImages: property.images || [],
        // No new images initially
        images: [],
      };
      
      reset(propertyData);
      
      console.log("Form initialized with property data:", {
        id: property._id,
        title: property.title,
        existingImages: property.images,
      });
    }
  }, [property, isLoading, reset]);

  const onSubmit = async (data: ExtendedPropertyInput) => {
    try {
  
      
      console.log("Submitting update data:", {
        id,
        hasNewImages: !!data.images && data.images.length > 0,
        existingImages: data.existingImages,
        newImageCount: data.images?.length || 0
      });

      await updateProperty(id, data);
      
      console.log("Property updated successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded m-4">
        Error loading property: {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded m-4">
        Property not found
      </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="mx-20 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-20 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Form Header */}
        <div className="px-20 pt-6">
          <h1 className="text-3xl font-bold text-gray-900">Update Property</h1>
          <p className="text-gray-600 mt-2">Edit the property details below</p>
        </div>

        <div className="grid grid-cols-3 gap-4 p-20">
          <div className="col-span-2">
            <UpdateImageForm />
          </div>
          <div className="col-span-1">
            <MainForm />
          </div>
        </div>

        <div className="flex justify-end p-20 pt-0 gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Property...
              </span>
            ) : (
              'Update Property'
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdatePropertyForm;