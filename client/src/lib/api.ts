import { Image } from "@shared/schema";

export interface GenerateImageResponse extends Image {}

/**
 * API client for interacting with the backend image generation service
 */
export const api = {
  /**
   * Generates an image using AI based on the provided prompt
   * @param prompt The text prompt to generate an image from
   * @returns Promise containing the generated image data
   * @throws Error if the API request fails
   */
  generateImage: async (prompt: string): Promise<GenerateImageResponse> => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || "Failed to generate image");
    }

    return response.json();
  },
};

/**
 * Type guard to check if an API error occurred
 */
export function isApiError(error: unknown): error is Error {
  return error instanceof Error;
}

