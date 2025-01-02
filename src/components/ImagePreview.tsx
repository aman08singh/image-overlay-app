import { useEffect, useRef } from 'react';

interface ImagePreviewProps {
  originalImage: string;
  removedBgImage: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  opacity: number;
}

export default function ImagePreview({
  originalImage,
  removedBgImage,
  text,
  fontFamily,
  fontSize,
  color,
  opacity,
}: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw removed background image
      const removedBgImg = new Image();
      removedBgImg.src = removedBgImage;
      removedBgImg.onload = () => {
        ctx.drawImage(removedBgImg, 0, 0);

        // Draw text
        ctx.globalAlpha = opacity / 100;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      };
    };
  }, [originalImage, removedBgImage, text, fontFamily, fontSize, color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
    />
  );
}