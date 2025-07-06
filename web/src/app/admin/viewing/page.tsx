'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Plus, MessageSquare, CheckCircle, XCircle, AlertCircle, MapPin, DollarSign, Loader2 } from 'lucide-react';
import useViewingStore from '../../store/ViewStore';
import usePropertyStore from '../../store/PropertyStore';
import useClientStore from '../../store/ClientStore'; // Assuming you have a client store

// TypeScript interfaces
export interface ViewingResponse {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
  };
  clientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddViewingRequest {
  propertyId: string;
  clientId: string;
  date: string;
  time: string;
  notes?: string;
}

interface ClientData {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface PropertyData {
  _id: string;
  title: string;
  location: string;
  price: number;
  type: string;
}

const ViewingManagement: React.FC = () => {
  const {
    viewings,
    isLoading,
    isSubmitting,
    error,
    success,
    scheduleViewing,
    getViewings,
    markAsCompleted,
    cancelViewing,
    markAsNoShow,
    updateNotes,
    clearMessages,
  } = useViewingStore();

  // Store hooks for fetching data
  const { 
    properties, 
    getProperties, 
    isLoading: propertiesLoading 
  } = usePropertyStore();
  
  const { 
    clients, 
    getClients, 
    isLoading: clientsLoading 
  } = useClientStore();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [selectedViewing, setSelectedViewing] = useState<ViewingResponse | null>(null);
  const [notes, setNotes] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<AddViewingRequest>({
    propertyId: '',
    clientId: '',
    date: '',
    time: '',
    notes: ''
  });

  // Fetch all data on component mount
  useEffect(() => {
    getViewings();
    getProperties(); // Fetch all properties
    getClients(); // Fetch all clients
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(clearMessages, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  const handleSubmit = async (): Promise<void> => {
    if (!formData.propertyId || !formData.clientId || !formData.date || !formData.time) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      // Ensure date is in correct format (YYYY-MM-DD)
      const submissionData = {
        ...formData,
        date: formData.date.includes('T') ? formData.date.split('T')[0] : formData.date,
        notes: formData.notes || undefined // Convert empty string to undefined
      };
      
      await scheduleViewing(submissionData);
      setShowForm(false);
      setFormData({ propertyId: '', clientId: '', date: '', time: '', notes: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNotesSubmit = async (): Promise<void> => {
    if (!selectedViewing) return;
    
    try {
      await updateNotes(selectedViewing._id, notes);
      setShowNotes(false);
      setSelectedViewing(null);
      setNotes('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status: ViewingResponse['status']): string => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'no_show': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatPrice = (price: number, type: string): string => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
    
    return type === 'rent' ? `${formattedPrice}/month` : formattedPrice;
  };

  const formatDateTime = (date: string, time: string): string => {
    try {
      // Handle different date formats
      let formattedDate = date;
      
      // If date is already in ISO format, extract just the date part
      if (date.includes('T')) {
        formattedDate = date.split('T')[0];
      }
      
      // Create date object
      const dateTime = new Date(`${formattedDate}T${time}`);
      
      // Check if date is valid
      if (isNaN(dateTime.getTime())) {
        return `${formattedDate} at ${time}`;
      }
      
      return dateTime.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      // Fallback if date parsing fails
      return `${date} at ${time}`;
    }
  };

  // Statistics
  const stats = {
    total: viewings.length,
    scheduled: viewings.filter((v: ViewingResponse) => v.status === 'scheduled').length,
    completed: viewings.filter((v: ViewingResponse) => v.status === 'completed').length,
    cancelled: viewings.filter((v: ViewingResponse) => v.status === 'cancelled').length,
    noShow: viewings.filter((v: ViewingResponse) => v.status === 'no_show').length
  };

  // Loading state for initial data fetch
  const isInitialLoading = isLoading || propertiesLoading || clientsLoading;

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading viewings data...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Viewing Management</h1>
          <p className="text-gray-600 mt-1">Manage property viewings and client appointments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Schedule Viewing
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Viewings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.noShow}</div>
          <div className="text-sm text-gray-600">No Shows</div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Viewings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {viewings.map((viewing: ViewingResponse) => (
          <div key={viewing._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{viewing.propertyId.title}</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {viewing.propertyId.location}
                </div>
                <div className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatPrice(viewing.propertyId.price, viewing.propertyId.type)}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(viewing.status)}`}>
                {viewing.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{viewing.clientId.name}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{viewing.clientId.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{formatDateTime(viewing.date, viewing.time)}</span>
              </div>
            </div>

            {viewing.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{viewing.notes}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {viewing.status === 'scheduled' && (
                <>
                  <button
                    onClick={() => markAsCompleted(viewing._id)}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-1 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Complete
                  </button>
                  <button
                    onClick={() => markAsNoShow(viewing._id)}
                    disabled={isSubmitting}
                    className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-1 text-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    No Show
                  </button>
                  <button
                    onClick={() => cancelViewing(viewing._id)}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1 text-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setSelectedViewing(viewing);
                  setNotes(viewing.notes || '');
                  setShowNotes(true);
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center gap-1 text-sm"
              >
                <MessageSquare className="h-4 w-4" />
                Notes
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewings.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No viewings scheduled yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Schedule Your First Viewing
          </button>
        </div>
      )}

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Schedule New Viewing</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property *</label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({...formData, propertyId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Property</option>
                  {properties.map((property: PropertyData) => (
                    <option key={property._id} value={property._id}>
                      {property.title} - {property.location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Client *</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Client</option>
                  {clients.map((client: ClientData) => (
                    <option key={client._id} value={client._id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 1 year from now
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Scheduling...
                  </span>
                ) : (
                  'Schedule Viewing'
                )}
              </button>
              <button
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotes && selectedViewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Viewing Notes</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter viewing notes..."
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">{notes.length}/1000 characters</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleNotesSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Notes'}
              </button>
              <button
                onClick={() => setShowNotes(false)}
                disabled={isSubmitting}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewingManagement;