"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddPropertyRequest } from "@/types/Property";
import { Textarea } from "@/components/ui/textarea";
import { PROPERTY_TYPES } from "@/app/config/AddPropertyConfig";

const MainForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AddPropertyRequest>();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Property title"
        />
        {errors.title && (
          <span className="text-red-500 text-sm">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price")}
          placeholder="Property price"
        />
        {errors.price && (
          <span className="text-red-500 text-sm">
            {errors.price.message}
          </span>
        )}
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location">Location</Label>
        <Controller
          name="location"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="Property location" />
          )}
        />
        {errors.location && (
          <span className="text-red-500 text-sm">
            {errors.location.message}
          </span>
        )}
      </div>

      {/* Type */}
      <div>
        <Label htmlFor="type">Property Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <span className="text-red-500 text-sm">{errors.type.message}</span>
        )}
      </div>

      {/* Bedrooms */}
      <div>
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Input
          id="bedrooms"
          type="number"
          min="0"
          {...register("bedrooms")}
          placeholder="Number of bedrooms"
        />
        {errors.bedrooms && (
          <span className="text-red-500 text-sm">
            {errors.bedrooms.message}
          </span>
        )}
      </div>

      {/* Bathrooms */}
      <div>
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input
          id="bathrooms"
          type="number"
          min="0"
          step="0.5"
          {...register("bathrooms")}
          placeholder="Number of bathrooms"
        />
        {errors.bathrooms && (
          <span className="text-red-500 text-sm">
            {errors.bathrooms.message}
          </span>
        )}
      </div>

      {/* Area */}
      <div>
        <Label htmlFor="area">Area (sq ft)</Label>
        <Input
          id="area"
          type="number"
          min="0"
          {...register("area")}
          placeholder="Property area in square feet"
        />
        {errors.area && (
          <span className="text-red-500 text-sm">
            {errors.area.message}
          </span>
        )}
      </div>

      {/* Amenities */}
      <div>
        <Label htmlFor="amenities">Amenities</Label>
        <Input
          id="amenities"
          {...register("amenities")}
          placeholder="Enter amenities (comma-separated)"
        />
        {errors.amenities && (
          <span className="text-red-500 text-sm">
            {errors.amenities.message}
          </span>
        )}
      </div>

      {/* Description - spans full width */}
      <div className="col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          {...register("description")}
          placeholder="Property description"
          rows={4}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default MainForm;