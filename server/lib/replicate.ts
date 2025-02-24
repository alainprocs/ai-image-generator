if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN environment variable is required");
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: "flux-sd-v2.0",
        input: {
          prompt,
          image_dimensions: "1024x1024",
          negative_prompt: "low quality, blurry, distorted",
        },
      }),
    });

    const prediction = await response.json();
    
    // Poll for completion
    const resultResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      }
    );

    const result = await resultResponse.json();
    return result.output[0];
  } catch (error) {
    console.error("Replicate API error:", error);
    throw error;
  }
}
