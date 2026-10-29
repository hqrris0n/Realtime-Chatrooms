// Shared input checks for request bodies

// Only accept base64 image data URLs (what the frontend's FileReader produces).
// Cloudinary would otherwise also fetch remote URLs or read file paths on the server.
const IMAGE_DATA_URL = /^data:image\/(png|jpe?g|webp|gif);base64,/;

export const isImageDataUrl = (value) => typeof value === "string" && IMAGE_DATA_URL.test(value);

export const MAX_MESSAGE_LENGTH = 2000;
