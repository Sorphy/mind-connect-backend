"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
// Configuration
cloudinary_1.v2.config({
    cloud_name: "dosxg5djg",
    api_key: "659795285683827",
    api_secret: "KXyC9YYT2ScTBVAhdTHbi0w6aW4"
});
// Upload function for different file types
const uploadFile = async (fileUrl, publicId, fileType) => {
    try {
        let uploadOptions = { public_id: publicId };
        if (fileType === "image") {
            uploadOptions = { ...uploadOptions, resource_type: "image" };
        }
        else if (fileType === "video") {
            uploadOptions = { ...uploadOptions, resource_type: "video" };
        }
        else if (fileType === "file") {
            uploadOptions = { ...uploadOptions, resource_type: "raw" };
        }
        const result = await cloudinary_1.v2.uploader.upload(fileUrl, uploadOptions);
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.uploadFile = uploadFile;
