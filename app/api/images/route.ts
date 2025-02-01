import { NextResponse } from "next/server";
import { generateImage } from "@/lib/services/image.service";
import { saveImage, getImages } from "@/lib/supabase/queries";

export async function GET() {
  try {
    const images = await getImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate image using fal-ai
    console.log("Generating image with prompt:", prompt);
    const imageUrl = await generateImage(prompt);
    console.log("Generated image URL:", imageUrl);

    if (!imageUrl) {
      throw new Error("No image URL returned from generation");
    }

    // Save to Supabase
    console.log("Saving to Supabase...");
    const savedImage = await saveImage(prompt, imageUrl);
    console.log("Saved image data:", savedImage);

    if (!savedImage) {
      throw new Error("Failed to save image to database");
    }

    return NextResponse.json({
      id: savedImage.id,
      prompt: savedImage.prompt,
      image_url: savedImage.image_url,
      storage_path: savedImage.storage_path,
      created_at: savedImage.created_at,
    });
  } catch (error) {
    // More detailed error logging
    console.error("Error in /api/images:");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : error
    );
    console.error("Full error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate image",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
