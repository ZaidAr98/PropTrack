import { Inquiry } from "../../model/Inquiry";
import { Response, Request } from "express";

// ADMIN FUNCTIONS

// Get all client inquiries (Admin view)
export const getClientInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiries = await Inquiry.find({})
      .populate("clientId", "name email phone")
      .populate("propertyId", "title location price type")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Client inquiries retrieved successfully",
      inquiries
    });
  } catch (error) {
    console.error("Error fetching client inquiries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete inquiry (Admin only)
export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }

    await Inquiry.findByIdAndDelete(id);

    res.status(200).json({
      message: "Inquiry deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};