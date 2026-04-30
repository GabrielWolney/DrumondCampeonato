import imageCompression from "browser-image-compression";
import { supabase } from "./supabase";

const BUCKET_NAME = "drumond-imagens";

export async function compressAndUpload(
  file: File,
  folder: string = "uploads",
  maxWidthOrHeight: number = 1080
): Promise<string | null> {
  try {
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight,
      fileType: "image/webp",
      useWebWorker: true,
    };
    const compressed = await imageCompression(file, options);

    const cleanName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.]/g, "")
      .substring(0, 50);

    const fileName = `${folder}-${Date.now()}-${cleanName}.webp`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, compressed, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.error("Erro no upload/compressão:", err);
    return null;
  }
}