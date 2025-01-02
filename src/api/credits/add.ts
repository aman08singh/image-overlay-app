import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, credits, orderId } = await req.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: credits
        }
      }
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response('Failed to add credits', { status: 500 });
  }
}