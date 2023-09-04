import { extname as _extname } from "path";
import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { CloudinaryStorage, Options as CloudinaryStorageOptions } from "multer-storage-cloudinary";

import { Request } from "express";
import { PostAttributes } from "../model/postModel"; // Import the PostAttributes interface from your model

// Configure Cloudinary
cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});

// Set The Storage Engine
const storageOptions: CloudinaryStorageOptions = {
  cloudinary: cloudinary,
  params: (req: Request, file: Express.Multer.File, cb: (error: Error | null, params: any) => void) => {
    const post: PostAttributes = req.body as PostAttributes; // Get the post data from the request body
    const userId = post.userId; // Assuming userId is available in the post data
    const postId = post.id; // Assuming postId is available in the post data
    const ext = _extname(file.originalname); // Get the file extension

    // Generate a unique filename based on the userId, postId, and current timestamp
    const filename = `${userId}-${postId}-${Date.now()}${ext}`;

    // Set the Cloudinary upload parameters
    const params = {
      folder: "uploads", // Specify the folder here
      allowed_formats: ["jpeg", "jpg", "png", "gif", "mp4", "avi", "mov", "pdf", "doc", "docx", "xls", "xlsx"],
      public_id: filename, // Use the filename as the public_id
    };

    cb(null, params);
  },
};

// Init Upload
const upload = multer({
  storage: new CloudinaryStorage(storageOptions),
  limits: { fileSize: 100000000000 },
});

export { upload };
