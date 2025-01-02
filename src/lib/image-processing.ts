import { imagekit } from './imagekit';

export async function uploadToImageKit(file: File, fileName: string) {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  return imagekit.upload({
    file: base64,
    fileName,
    folder: '/processed-images',
  });
}

export async function deleteFromImageKit(fileId: string) {
  return imagekit.deleteFile(fileId);
}

export async function processImage(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob'));
      }
    }, 'image/png');
  });
}