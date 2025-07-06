import { Client } from "../../model/Client";
import { Response, Request } from "express";


export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalCount = await Client.countDocuments(query);

    res.json({
      clients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};



// Get client by ID
export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }
    res.json({ client });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch client" });
  }
};

// Delete client
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete client" });
  }
};

// Get client stats
export const getClientStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalClients = await Client.countDocuments();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [recentClients, thisMonthClients] = await Promise.all([
      Client.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Client.countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    res.json({
      stats: { totalClients, recentClients, thisMonthClients }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};