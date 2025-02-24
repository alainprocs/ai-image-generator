import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertImageSchema } from "@shared/schema";
import { expandPrompt } from "./lib/openai";
import { generateImage } from "./lib/replicate";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
      const result = insertImageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid prompt" });
      }

      const { prompt } = result.data;

      // Expand prompt using OpenAI
      const expandedPrompt = await expandPrompt(prompt);

      // Generate image using Replicate
      const imageUrl = await generateImage(expandedPrompt);

      // Store the result
      const image = await storage.createImage({
        prompt,
        expandedPrompt,
        imageUrl,
      });

      res.json(image);
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
