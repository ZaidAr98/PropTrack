import { MessageSquare } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import useInquiryStore from '../../../store/InquiryStore' // Adjust path as needed

const InquiryDialog = ({propertyId}: {propertyId: string}) => {
  const { submitInquiry, isSubmitting, error, success } = useInquiryStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const inquiryData: any = {
      propertyId,
      name: formData.name,
      email: formData.email,
      message: formData.message
    };

    // Only include phone if it has a value
    if (formData.phone && formData.phone.trim() !== '') {
      inquiryData.phone = formData.phone;
    }

    try {
      await submitInquiry(inquiryData);
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      // Close dialog on success
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      // Error handling is already done in the store
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 hover:scale-105 transition-all duration-200 flex items-center justify-center"
          disabled={isSubmitting}
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="mx-auto" size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Inquiry</DialogTitle>
          <DialogDescription>
            Interested in this property? Send us your inquiry and we'll get back to you soon.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number (optional)"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your interest in this property..."
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
              {success}
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                disabled={isSubmitting}
                onClick={resetForm}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default InquiryDialog