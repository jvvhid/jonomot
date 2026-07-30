import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data" },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mimeType = file.type || "image/jpeg";
    const isVideo = mimeType.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|avi|mkv)$/i);

    // 1. Try Upload via Cloudinary if keys are configured
    if (isCloudinaryConfigured) {
      try {
        const uploadResult: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "jonomot_bangladesh",
              resource_type: isVideo ? "video" : "auto",
              chunk_size: 6000000, // 6MB chunk size for reliable video streaming
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        return NextResponse.json({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          format: uploadResult.format || (isVideo ? "mp4" : "jpg"),
          source: "cloudinary",
        });
      } catch (cloudinaryErr: any) {
        console.warn("Cloudinary upload failed, using seamless Data URL fallback:", cloudinaryErr?.message || cloudinaryErr);
        // Fall through to Base64 Data URL fallback below
      }
    }

    // 2. Seamless Fallback: Convert to base64 Data URL so image/video upload NEVER fails
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      url: dataUrl,
      public_id: `local-${Date.now()}-${file.name}`,
      format: mimeType.split("/")[1] || "jpeg",
      source: "local-base64",
    });
  } catch (err: any) {
    console.error("Upload error in /api/upload:", err);
    return NextResponse.json(
      { error: "Failed to upload file", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}

