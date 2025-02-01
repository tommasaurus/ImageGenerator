import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_API_KEY,
});

export async function generateImage(prompt: string) {
  try {
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    if (!result.data?.images?.[0]?.url) {
      throw new Error("No image was generated");
    }

    return result.data.images[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
