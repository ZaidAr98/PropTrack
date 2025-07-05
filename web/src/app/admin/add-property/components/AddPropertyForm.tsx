'use client';
import React from "react";
import ImageForm from "./ImageForm";
import MainForm from "./MainForm";
import { FormProvider, useForm } from "react-hook-form";
import { AddPropertyRequest } from "@/types/Property";



type ExtendedPropertyInput = AddPropertyRequest & {
  images?: File[];
  imageUrls?: string[];
};


const AddPropertyForm = () => {
    const formMethods = useForm<ExtendedPropertyInput>();

      const onSubmit = async (data: ExtendedPropertyInput) => {
    try {
      
      console.log("Form Data:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };



  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
     
       

        <div className="grid grid-cols-3 gap-4 p-20">
          <div className="col-span-2">
            <ImageForm />
          </div>
          <div className="col-span-3">
            <MainForm />
          </div>
        </div>
        
        <div className="flex justify-end p-20 pt-0">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

export default AddPropertyForm