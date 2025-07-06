import { Inquiry } from "../../model/Inquiry";
import { Client } from "../../model/Client";
import { Property } from "../../model/Property";
import { Response, Request } from "express";


export const submitInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, propertyId, message } = req.body;

    // Validation
    if (!name || !email || !propertyId || !message) {
      res.status(400).json({ error: "Name, email, property, and message are required" });
      return;
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    // Find or create client
    let client = await Client.findOne({ email: email.toLowerCase() });
    
    if (!client) {
      // Create new client if doesn't exist
      client = new Client({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : undefined
      });
      await client.save();
    }

    // Create inquiry
    const newInquiry = new Inquiry({
      clientId: client._id,
      propertyId,
      message: message.trim()
    });

    await newInquiry.save();

    // Populate the response
    const populatedInquiry = await Inquiry.findById(newInquiry._id)
      .populate("clientId", "name email phone")
      .populate("propertyId", "title location price type");

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry: populatedInquiry
    });
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};