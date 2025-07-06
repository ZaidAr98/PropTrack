"use client";
import usePropertyStore from "../../store/PropertyStore";
import React, { useEffect, useState } from "react";
import PropertyCard from "./components/PropertyCard";
import {
  Loader2,
  RefreshCw,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const PropertyPage = () => {
  const {
    isLoading,
    getProperties,
    error,
    properties,
    // Search-related state
    isSearching,
    filteredProperties,
    totalCount,
    filters,
    searchProperties,
    setFilters,
    clearFilters,
    searchPropertiesWithPagination,
    pagination,
  } = usePropertyStore();

  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localMaxPrice, setLocalMaxPrice] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Determine which data to display and if we're in search mode
  const isSearchMode = hasSearched || Object.keys(filters).length > 0;
  const displayProperties = isSearchMode ? filteredProperties : properties;
  const currentPagination = pagination;
  const isLoadingState = isLoading || isSearching;

  // Initialize data on component mount
  useEffect(() => {
    if (!hasSearched && Object.keys(filters).length === 0) {
      getProperties(1, 12);
    }
  }, []);

  // Debounced max price filter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMaxPrice !== filters.maxPrice) {
        handleFilterChange("maxPrice", localMaxPrice);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localMaxPrice]);

  // Trigger search when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      setHasSearched(true);
      searchProperties(filters, 1, 12);
    }
  }, [filters]);

  const handleRefresh = () => {
    if (isSearchMode) {
      const currentPage = currentPagination?.currentPage || 1;
      const currentLimit = currentPagination?.limit || 12;
      searchProperties(filters, currentPage, currentLimit);
    } else {
      const currentPage = currentPagination?.currentPage || 1;
      const currentLimit = currentPagination?.limit || 12;
      getProperties(currentPage, currentLimit);
    }
  };

  const handleSearch = () => {
    if (localSearchTerm.trim()) {
      setFilters({ searchTerm: localSearchTerm.trim() });
    } else if (localSearchTerm === "" && filters.searchTerm) {
      // Clear search term if input is empty
      setFilters({ searchTerm: "" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    setLocalMaxPrice("");
    setHasSearched(false);
    clearFilters();
    getProperties(1, 12);
  };

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" and "default" back to empty string for the API
    const apiValue = value === "all" || value === "default" ? "" : value;
    setFilters({ [key]: apiValue });
  };

  const handlePageChange = (page: number) => {
    if (isSearchMode) {
      searchPropertiesWithPagination(page, currentPagination?.limit || 12);
    } else {
      getProperties(page, currentPagination?.limit || 12);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const resultsCount = isSearchMode
    ? currentPagination?.totalCount || totalCount
    : currentPagination?.totalCount || displayProperties.length;

  if (isLoadingState && displayProperties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">
          {isSearching ? "Searching properties..." : "Loading properties..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2 text-destructive">
              Error
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (displayProperties.length === 0 && !isLoadingState) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search properties by title, location, type..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">
              {isSearchMode ? "No Results Found" : "No Properties Available"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isSearchMode
                ? "Try adjusting your search criteria or filters."
                : "There are currently no properties in our listings."}
            </p>
            <div className="flex gap-2">
              {isSearchMode && (
                <Button onClick={handleClearSearch} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </Button>
              )}
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Our Properties</h1>
          <p className="text-muted-foreground mt-1">
            {isSearchMode
              ? `Found ${resultsCount} properties matching your criteria`
              : `Discover our collection of ${resultsCount} properties`}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={isLoadingState}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoadingState ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search properties by title, location, type..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {filters.searchTerm}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setLocalSearchTerm("");
                    setFilters({ searchTerm: "" });
                  }}
                />
              </Badge>
            )}
            {filters.propertyType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type: {filters.propertyType}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilters({ propertyType: "" })}
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {filters.location}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilters({ location: "" })}
                />
              </Badge>
            )}
            {filters.bedrooms && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Bedrooms: {filters.bedrooms}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilters({ bedrooms: "" })}
                />
              </Badge>
            )}
            {filters.minPrice && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min: ${filters.minPrice}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilters({ minPrice: "" })}
                />
              </Badge>
            )}
            {filters.maxPrice && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max: ${filters.maxPrice}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setLocalMaxPrice("");
                    setFilters({ maxPrice: "" });
                  }}
                />
              </Badge>
            )}
            {filters.sort && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Sort:{" "}
                {filters.sort === "priceHighLow"
                  ? "Price: High to Low"
                  : filters.sort === "priceLowHigh"
                  ? "Price: Low to High"
                  : filters.sort === "newest"
                  ? "Newest First"
                  : filters.sort}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilters({ sort: "" })}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Property Type
                </label>
                <Select
                  value={filters.propertyType || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("propertyType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Bedrooms
                </label>
                <Select
                  value={filters.bedrooms || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("bedrooms", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4 Bedrooms</SelectItem>
                    <SelectItem value="5">5+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  step="1000"
                  value={filters.minPrice || ""}
                  onChange={(e) => setFilters({ minPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="1000000"
                  min="0"
                  step="1000"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sort By
                </label>
                <Select
                  value={filters.sort || "default"}
                  onValueChange={(value) => handleFilterChange("sort", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Newest)</SelectItem>
                    <SelectItem value="priceLowHigh">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="priceHighLow">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading overlay for search */}
      {isSearching && displayProperties.length > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Updating results...</span>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-7 mb-8">
        {displayProperties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>

      {/* Pagination */}
    {currentPagination && currentPagination.totalPages > 1 && (
  <Card>
    <CardContent className="py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {(() => {
            const currentPage = currentPagination.currentPage || 1;
            const limit = currentPagination.limit || 12;
            // Use the total count from pagination, but fall back to resultsCount which should be the total
            const totalCount = currentPagination.totalCount || resultsCount || 0;
            const currentPageItemCount = displayProperties.length;
            
            if (totalCount === 0) {
              return "No results";
            }
            
            const fromItem = ((currentPage - 1) * limit) + 1;
            // For the last page, show the actual number of items displayed
            const toItem = currentPage === currentPagination.totalPages 
              ? fromItem + currentPageItemCount - 1
              : Math.min(currentPage * limit, totalCount);
            
            return `Showing ${fromItem} to ${toItem} of ${totalCount} results`;
          })()}
        </div>
                       
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange((currentPagination.currentPage || 1) - 1)}
            disabled={!currentPagination.hasPreviousPage || isLoadingState}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
                         
          <div className="flex items-center gap-1">
            {/* Page numbers */}
            {Array.from({ length: currentPagination.totalPages || 1 }, (_, i) => i + 1)
              .filter((page) => {
                const current = currentPagination.currentPage || 1;
                const totalPages = currentPagination.totalPages || 1;
                return (
                  page === 1 ||
                  page === totalPages ||
                  (page >= current - 1 && page <= current + 1)
                );
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={page === (currentPagination.currentPage || 1) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={isLoadingState}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}
          </div>
                         
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange((currentPagination.currentPage || 1) + 1)}
            disabled={!currentPagination.hasNextPage || isLoadingState}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
      )}
    </div>
  );
};

export default PropertyPage;
