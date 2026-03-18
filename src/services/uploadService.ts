import imageCompression from 'browser-image-compression';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqxlc84z6';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'pe_studio_upload';

export async function uploadVideoToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Video upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  // 1. Compress and resize image
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  };
  
  const compressedFile = await imageCompression(file, options);

  // 2. Upload to Cloudinary
  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const data = await response.json();
  // Append transformations for automatic optimization
  return `${data.secure_url}?f_auto,q_auto`;
}
