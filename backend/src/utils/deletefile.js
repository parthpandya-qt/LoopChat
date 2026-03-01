import { v2 as cloudinary } from "cloudinary";

const extractPublicId = (url) => {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");

    
    const publicIdParts = parts.slice(uploadIndex + 2);

    const fileName = publicIdParts.pop();
    const fileNameWithoutExt = fileName.split(".")[0];

    publicIdParts.push(fileNameWithoutExt);

    return publicIdParts.join("/");
};

export const deleteFromCloudinaryByUrl = async (url) => {
    try {
        if (!url) return;

        const publicId = extractPublicId(url);
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete error:", error.message);
    }
};