if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN environment variable is required");
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    // Start the prediction
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
        input: {
          prompt,
          image_dimensions: "1024x1024",
          negative_prompt: "low quality, blurry, distorted",
          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
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
            "Content-Type": "application/json",
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