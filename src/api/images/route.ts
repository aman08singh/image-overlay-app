import { prisma } from '@/lib/db';
import { deleteFromImageKit } from '@/lib/image-processing';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return new Response('User ID is required', { status: 400 });
  }

  try {
    const images = await prisma.image.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch images', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const imageId = segments[segments.length - 1];

  try {
    const image = await prisma.image.delete({
      where: { id: imageId }
    });

    // Delete from ImageKit
    await deleteFromImageKit(image.imageUrl.split('/').pop()!);

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response('Failed to delete image', { status: 500 });
  }
}