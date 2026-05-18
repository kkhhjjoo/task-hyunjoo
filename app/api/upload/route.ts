import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getImageMimeError, resolveImageMime } from "@/lib/image-file";

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

async function uploadToLocal(file: File, buffer: Buffer, mime: string) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext =
    mime.split("/")[1]?.replace("jpeg", "jpg") ??
    file.name.split(".").pop()?.toLowerCase() ??
    "jpg";
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${Date.now()}-${safeName || `image.${ext}`}`;
  const filepath = path.join(uploadsDir, filename);

  await writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

async function uploadToCloudinary(buffer: Buffer, mime: string) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const base64 = buffer.toString("base64");
  const dataUri = `data:${mime};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "todos",
    resource_type: "image",
    transformation: [
      { width: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });

  return result.secure_url;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const validationError = getImageMimeError(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const mime = resolveImageMime(file);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl = hasCloudinaryConfig()
      ? await uploadToCloudinary(buffer, mime)
      : await uploadToLocal(file, buffer, mime);

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json(
      { error: "업로드에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
