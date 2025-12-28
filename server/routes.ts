import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { applicationSchema, applicationStatuses } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Submit a new application
  app.post("/api/applications", async (req, res) => {
    try {
      const result = applicationSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: result.error.errors,
        });
      }

      const application = await storage.createApplication(result.data);

      return res.status(201).json({
        message: "Application submitted successfully",
        referenceNumber: application.referenceNumber,
        status: application.status,
      });
    } catch (error) {
      console.error("Error creating application:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get application by reference number
  app.get("/api/applications/:referenceNumber", async (req, res) => {
    try {
      const { referenceNumber } = req.params;
      const application = await storage.getApplication(referenceNumber);

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      return res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update application status
  app.patch("/api/applications/:referenceNumber/status", async (req, res) => {
    try {
      const { referenceNumber } = req.params;
      const { status } = req.body;

      if (!status || !applicationStatuses.includes(status)) {
        return res.status(400).json({ 
          error: "Invalid status",
          validStatuses: applicationStatuses,
        });
      }

      const updated = await storage.updateApplicationStatus(referenceNumber, status);

      if (!updated) {
        return res.status(404).json({ error: "Application not found" });
      }

      return res.json({
        message: "Application status updated successfully",
        application: updated,
      });
    } catch (error) {
      console.error("Error updating application:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
