import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export async function processAndUploadImage(file: File): Promise<string> {
  // 1. Compress and resize image
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  };
  
  const compressedFile = await imageCompression(file, options);

  // 2. Upload to Firebase Storage
  const uniqueId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
  const storageRef = ref(storage, `uploads/${uniqueId}_${file.name}`);
  
  await uploadBytes(storageRef, compressedFile);
  const downloadUrl = await getDownloadURL(storageRef);
  
  return downloadUrl;
}
