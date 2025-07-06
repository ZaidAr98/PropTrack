import { upload } from "../config/multerConfig";
import { addProperty, archiveProperty, deleteProperty, editProperty, getClientInquiries } from "../controllers/admin/property.controller";
import { addViewingNotes, cancelViewing, getAllViewings, markViewingAsCompleted, markViewingAsNoShow, scheduleViewing } from "../controllers/admin/view.controller";
import express from "express";
import { getProperties, getPropertyDetails, filterProperties } from "../controllers/public/property.controller";
import { getClients, getClientStats, getClientById, deleteClient } from "../controllers/admin/clientManagment.controller";
import { deleteInquiry } from "../controllers/admin/inquiries.controller";



const router = express.Router();


// Add new property
router.post('/admin/properties', upload.array('images', 5), addProperty);
// Edit existing property
router.put('/admin/properties/:id', upload.array('images', 5), editProperty);
// Archive property
router.put('/admin/properties/:id/archive', archiveProperty);
// Delete property 
router.delete('/admin/properties/:id', deleteProperty);

// Filter properties for admin
router.get('/admin/properties/search', filterProperties);

//public routes for properties
// Get all properties 
router.get('/admin/properties', getProperties);

// Get single property for admin
router.get('/admin/properties/:id', getPropertyDetails);





//private routes for viewings

// POST - Schedule new viewing
router.post('/admin/viewings', scheduleViewing);
// GET - Get all viewings
router.get('/admin/viewings', getAllViewings);
// PUT - Update viewing status
router.put('/admin/viewings/:id/complete', markViewingAsCompleted);
router.put('/admin/viewings/:id/no-show', markViewingAsNoShow);
router.put('/admin/viewings/:id/cancel', cancelViewing);

// PUT - Add notes
router.put('/admin/viewings/:id/notes', addViewingNotes);





// Client management routes
router.get('/admin/clients', getClients);
router.get('/admin/clients/stats', getClientStats);
router.get('/admin/clients/:id', getClientById);
router.delete('/admin/clients/:id', deleteClient);



//admin inquiries routes
router.get('/admin/inquiries', getClientInquiries);
router.delete('/admin/inquiries/:id', deleteInquiry);


export default router;

