import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { uploadImage, uploadVideo } from "../lib/cloudinary";

export async function createProduct(data, imageFiles, videoFile) {
  const imageUrls = [];

  for (const file of imageFiles) {
    const url = await uploadImage(file);
    imageUrls.push(url);
  }

  let videoUrl = null;
  if (videoFile) {
    videoUrl = await uploadVideo(videoFile);
  }

  await addDoc(collection(db, "products"), {
    ...data,
    images: imageUrls,
    videoUrl,
    createdAt: serverTimestamp()
  });
}