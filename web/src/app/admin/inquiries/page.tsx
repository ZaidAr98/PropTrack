'use client';
import React, { useEffect } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import useInquiryStore from '../../store/InquiryStore';

// TypeScript interfaces
interface InquiryResponse {
  _id: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  propertyId: {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
}

const AdminInquiriesPage: React.FC = () => {
  const {
    inquiries,
    isLoading,
    isDeleting,
    error,
    success,
    getClientInquiries,
    deleteInquiry,
    clearMessages,
  } = useInquiryStore();

  useEffect(() => {
    getClientInquiries();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(clearMessages, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  const handleDelete = async (id: string, clientName: string): Promise<void> => {
    if (window.confirm(`Delete inquiry from ${clientName}?`)) {
      try {
        await deleteInquiry(id);
      } catch (error) {
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Client Inquiries</h1>

      {/* Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      {/* Inquiries List */}
      <div className="space-y-4">
        {inquiries.map((inquiry: InquiryResponse) => (
          <div key={inquiry._id} className="bg-white p-6 rounded border shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{inquiry.clientId.name}</h3>
                <p className="text-gray-600">{inquiry.clientId.email}</p>
                <p className="text-gray-600">{inquiry.clientId.phone}</p>
                <p className="text-sm text-gray-500">{formatDate(inquiry.createdAt)}</p>
              </div>
              <button
                onClick={() => handleDelete(inquiry._id, inquiry.clientId.name)}
                disabled={isDeleting}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium">Property: {inquiry.propertyId.title}</h4>
              <p className="text-gray-600">{inquiry.propertyId.location}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Message:</h4>
              <p className="text-gray-800">{inquiry.message}</p>
            </div>
          </div>
        ))}
      </div>

      {inquiries.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No inquiries yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesPage;