import { Viewing } from "../../model/Viewing";
import { Client } from "../../model/Client";
import { Property } from "../../model/Property";
import { Response, Request } from "express";

export const scheduleViewing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { propertyId, clientId, date, time, notes } = req.body;
    if (!propertyId || !clientId || !date || !time) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const viewingDate = new Date(date);

    const currentDate = new Date();

    if (isNaN(viewingDate.getTime())) {
      res.status(400).json({ error: "Invalid date format" });
      return;
    }

    if (viewingDate < currentDate) {
      res.status(400).json({ error: "Viewing date must be in the future" });
      return;
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      res.status(400).json({ error: "Invalid time format. Use HH:MM format" });
      return;
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    const client = await Client.findById(clientId);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }



    

    const existingViewing = await Viewing.findOne({
      propertyId: propertyId,
      date: viewingDate,
      time: time,
      status: { $ne: "cancelled" }, // Ignore cancelled viewings
    });

    if (existingViewing) {
      res.status(409).json({
        error:
          "A viewing is already scheduled for this property at the specified date and time",
      });
      return;
    }

    const newViewing = new Viewing({
      propertyId: propertyId,
      clientId: clientId,
      date: viewingDate,
      time: time,
      status: "scheduled",
    });

    await newViewing.save();
    const populatedViewing = await Viewing.findById(newViewing._id)
      .populate("clientId", "name email phone")
      .populate("propertyId", "title location price type");

    res.status(201).json({
      message: "Viewing scheduled successfully",
      viewing: populatedViewing,
    });
  } catch (error) {
    console.error("Error scheduling viewing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Add this to your view.controller.ts file
export const getAllViewings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const viewings = await Viewing.find({})
      .populate("clientId", "name email phone")
      .populate("propertyId", "title location price type")
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      message: "Viewings retrieved successfully",
      viewings: viewings,
    });
  } catch (error) {
    console.error("Error fetching viewings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markViewingAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const existingViewing = await Viewing.findById(id);
    if (!existingViewing) {
      res.status(404).json({ error: "Viewing not found" });
      return;
    }
    if (existingViewing.status === "completed") {
      res.status(400).json({ error: "Viewing is already marked as completed" });
      return;
    }

    if (existingViewing.status === "cancelled") {
      res
        .status(400)
        .json({ error: "Cannot mark cancelled viewing as completed" });
      return;
    }

    const updateData: any = {
      status: "completed",
    };

    if (notes) {
      updateData.notes = notes.trim();
    }

    const updatedViewing = await Viewing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("clientId", "name email phone")
      .populate("propertyId", "title location price type");

    res.status(200).json({
      message: "Viewing marked as completed successfully",
      viewing: updatedViewing,
    });
  } catch (error) {
    console.error("Error marking viewing as completed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};








export const cancelViewing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;


    const existingViewing = await Viewing.findById(id);
    if (!existingViewing) {
      res.status(404).json({ error: "Viewing not found" });
      return;
    }

  
    if (existingViewing.status === 'cancelled') {
      res.status(400).json({ error: "Viewing is already cancelled" });
      return;
    }

    if (existingViewing.status === 'completed') {
      res.status(400).json({ error: "Cannot cancel completed viewing" });
      return;
    }

    if (existingViewing.status === 'no_show') {
      res.status(400).json({ error: "Cannot cancel no-show viewing" });
      return;
    }

   
    const updateData: any = {
      status: 'cancelled'
    };

    if (notes) {
      updateData.notes = notes.trim();
    }

    const updatedViewing = await Viewing.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('clientId', 'name email phone')
     .populate('propertyId', 'title location price type');

    res.status(200).json({
      message: "Viewing cancelled successfully",
      viewing: updatedViewing
    });
  } catch (error) {
    console.error("Error cancelling viewing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const markViewingAsNoShow = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

 
    const existingViewing = await Viewing.findById(id);
    if (!existingViewing) {
      res.status(404).json({ error: "Viewing not found" });
      return;
    }

  
    if (existingViewing.status === 'no_show') {
      res.status(400).json({ error: "Viewing is already marked as no-show" });
      return;
    }

    if (existingViewing.status === 'completed') {
      res.status(400).json({ error: "Cannot mark completed viewing as no-show" });
      return;
    }

    if (existingViewing.status === 'cancelled') {
      res.status(400).json({ error: "Cannot mark cancelled viewing as no-show" });
      return;
    }

    const updateData: any = {
      status: 'no_show'
    };

  
    if (notes) {
      updateData.notes = notes.trim();
    }

    const updatedViewing = await Viewing.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('clientId', 'name email phone')
     .populate('propertyId', 'title location price type');

    res.status(200).json({
      message: "Viewing marked as no-show successfully",
      viewing: updatedViewing
    });
  } catch (error) {
    console.error("Error marking viewing as no-show:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const addViewingNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    
    if (!notes || notes.trim() === '') {
      res.status(400).json({ error: "Notes are required" });
      return;
    }

    if (notes.length > 1000) {
      res.status(400).json({ error: "Notes must be 1000 characters or less" });
      return;
    }

   
    const existingViewing = await Viewing.findById(id);
    if (!existingViewing) {
      res.status(404).json({ error: "Viewing not found" });
      return;
    }

   
    const updatedViewing = await Viewing.findByIdAndUpdate(
      id,
      { notes: notes.trim() },
      { new: true, runValidators: true }
    ).populate('clientId', 'name email phone')
     .populate('propertyId', 'title location price type');

    res.status(200).json({
      message: "Viewing notes updated successfully",
      viewing: updatedViewing
    });
  } catch (error) {
    console.error("Error adding viewing notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};