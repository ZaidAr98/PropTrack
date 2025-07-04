import { Client } from "../../model/Client";
import { Inquiry } from "../../model/Inquiry";
import { Property } from "../../model/Property";
import { Response, Request } from "express";

export const submitInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      propertyId,
      message
    } = req.body;

   
    if (!name || !email || !phone || !propertyId || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Please provide a valid email address" });
      return;
    }

    
    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    
    let client = await Client.findOne({ email: email.toLowerCase() });
    
    if (!client) {
     
      client = new Client({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim()
      });
      await client.save();
    } else {
      // Update client info if they provided new details
      client.name = name.trim();
      client.phone = phone.trim();
      await client.save();
    }

    // Create new inquiry
    const inquiry = new Inquiry({
      clientId: client._id,
      propertyId: propertyId,
      message: message.trim()
    });

    await inquiry.save();

    // Populate the inquiry with client and property details for response
    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('clientId', 'name email phone')
      .populate('propertyId', 'title location price type');

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry: populatedInquiry
    });
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};