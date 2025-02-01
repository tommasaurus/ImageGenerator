import { supabase } from "./config";

export async function saveImage(prompt: string, imageUrl: string) {
  try {
    // First fetch the image from Fal AI
    const response = await fetch(imageUrl);
    const imageBuffer = await response.blob();

    // Generate a unique filename
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.png`;
    const storagePath = `${fileName}`;

    // Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("generated-images")
      .upload(storagePath, imageBuffer);

    if (storageError) throw storageError;

    // Get the public URL of the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("generated-images").getPublicUrl(storagePath);

    // Save metadata to database
    const { data, error } = await supabase
      .from("image_generations")
      .insert({
        prompt: prompt,
        image_url: publicUrl, // Use Supabase URL instead of Fal AI URL
        storage_path: storagePath,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
}

export async function getImages() {
  const { data, error } = await supabase
    .from("image_generations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return data;
}
