import { type Image, type InsertImage } from "@shared/schema";

export interface IStorage {
  createImage(image: {
    prompt: string;
    expandedPrompt: string;
    imageUrl: string;
  }): Promise<Image>;
}

export class MemStorage implements IStorage {
  private images: Map<number, Image>;
  private currentId: number;

  constructor() {
    this.images = new Map();
    this.currentId = 1;
  }

  async createImage(image: {
    prompt: string;
    expandedPrompt: string;
    imageUrl: string;
  }): Promise<Image> {
    const id = this.currentId++;
    const newImage: Image = {
      id,
      prompt: image.prompt,
      expandedPrompt: image.expandedPrompt,
      imageUrl: image.imageUrl,
      createdAt: new Date(),
    };
    this.images.set(id, newImage);
    return newImage;
  }
}

export const storage = new MemStorage();
