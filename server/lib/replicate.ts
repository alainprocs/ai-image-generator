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
        version: "black-forest-labs/flux-schnell",
        input: {
          prompt,
        },
      }),
    });

    const prediction = await response.json();
    if (!prediction.id) {
      throw new Error("Failed to start image generation");
    }

    // Poll for completion
    let result;
    for (let i = 0; i < 30; i++) {
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      );

      result = await pollResponse.json();

      if (result.status === "succeeded" && result.output && result.output[0]) {
        return result.output[0];
      }

      if (result.status === "failed") {
        throw new Error("Image generation failed: " + result.error);
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error("Timeout waiting for image generation");
  } catch (error) {
    console.error("Replicate API error:", error);
    throw error;
  }
}