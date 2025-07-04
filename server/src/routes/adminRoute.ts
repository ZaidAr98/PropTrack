import { upload } from "../config/multerConfig";
import { addProperty, archiveProperty, deleteProperty, editProperty, getClientInquiries } from "../controllers/admin/property.controller";
import { addViewingNotes, cancelViewing, markViewingAsCompleted, markViewingAsNoShow, scheduleViewing } from "../controllers/admin/view.controller";
import express from "express";
import { getProperties, getPropertyDetails, filterProperties } from "../controllers/public/property.controller";



const router = express.Router();


// Add new property
router.post('/admin/properties', upload.array('images', 5), addProperty);
// Edit existing property
router.put('/admin/properties/:id', upload.array('images', 5), editProperty);
// Archive property
router.put('/admin/properties/:id/archive', archiveProperty);
// Delete property 
router.delete('/admin/properties/:id', deleteProperty);



//public routes for properties
// Get all properties 
router.get('/admin/properties', getProperties);

// Get single property for admin
router.get('/admin/properties/:id', getPropertyDetails);

// Filter properties for admin
router.get('/admin/properties/search', filterProperties);



//private routes for viewings

// POST - Schedule new viewing
router.post('/admin/viewings', scheduleViewing);

// PUT - Update viewing status
router.put('/admin/viewings/:id/complete', markViewingAsCompleted);
router.put('/admin/viewings/:id/no-show', markViewingAsNoShow);
router.put('/admin/viewings/:id/cancel', cancelViewing);

// PUT - Add notes
router.put('/admin/viewings/:id/notes', addViewingNotes);



// Get client inquiries
router.get('/admin/inquiries', getClientInquiries);


export default router;

