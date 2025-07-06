
import express from 'express';
import { submitInquiry } from '../controllers/client/property.controller';
import { filterProperties, getProperties, getPropertyDetails } from '../controllers/public/property.controller';

const router = express.Router();

// Get all properties 
router.get('/client/properties', getProperties);

// Get single property for client
router.get('/client/properties/:id', getPropertyDetails);

// Filter properties for client
router.get('/client/properties/search', filterProperties);


router.post('/inquiries', submitInquiry);


export default router;