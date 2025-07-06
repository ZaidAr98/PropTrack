import { Trash } from 'lucide-react'
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
import React from 'react'
import { Button } from '@/components/ui/button'
import usePropertyStore from '../../../store/PropertyStore'
import { useRouter } from 'next/navigation'

const DeleteDialog = ({propertyId}: {propertyId: string}) => {
  const { deleteProperty, isSubmitting } = usePropertyStore();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteProperty(propertyId);
      router.push('/admin/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      // Error handling is already done in the store
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="w-1/2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-800 disabled:bg-gray-400 hover:scale-105 transition-all duration-200 flex items-center justify-center"
          disabled={isSubmitting}
        >
          <Trash className="mx-auto" size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this property? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog