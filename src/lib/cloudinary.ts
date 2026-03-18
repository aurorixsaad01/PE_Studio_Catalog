const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: "POST", body: fd }
  );

  const data = await res.json();
  return data.secure_url;
}

export async function uploadVideo(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/video/upload`,
    { method: "POST", body: fd }
  );

  const data = await res.json();
  return data.secure_url;
}