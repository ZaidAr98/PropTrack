'use client';
import React, { useEffect } from "react";
import ImageForm from "./ImageForm";
import MainForm from "./MainForm";
import { FormProvider, useForm } from "react-hook-form";
import { AddPropertyRequest } from "@/types/Property";
import usePropertyStore from "../../../store/PropertyStore"; 

type ExtendedPropertyInput = AddPropertyRequest & {
  images?: File[];
  imageUrls?: string[];
};

const AddPropertyForm = () => {
  const formMethods = useForm<ExtendedPropertyInput>();
  const { addProperty, isSubmitting, error, success, clearMessages } = usePropertyStore();

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearMessages();
        formMethods.reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearMessages, formMethods]);

  const onSubmit = async (data: ExtendedPropertyInput) => {
    try {
      await addProperty(data);
      console.log("Property added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Error Message */}
        {error && (
          <div className="mx-20 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mx-20 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 p-20">
          <div className="col-span-2">
            <ImageForm />
          </div>
          <div className="col-span-2">
            <MainForm />
          </div>
        </div>
        
        <div className="flex justify-end p-20 pt-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddPropertyForm;