import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export async function uploadVideo(file: File): Promise<string> {
  const uniqueId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
  const storageRef = ref(storage, `products/videos/${uniqueId}_${file.name}`);
  
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  
  return downloadUrl;
}

export async function processAndUploadImage(file: File, folder: string = 'uploads'): Promise<string> {
  // 1. Compress and resize image
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  };
  
  const compressedFile = await imageCompression(file, options);

  // 2. Upload to Firebase Storage
  const uniqueId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
  const storageRef = ref(storage, `${folder}/${uniqueId}_${file.name}`);
  
  await uploadBytes(storageRef, compressedFile);
  const downloadUrl = await getDownloadURL(storageRef);
  
  return downloadUrl;
}
