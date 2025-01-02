import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast';
import { CREDIT_PACKAGES } from '@/lib/credits';
import { createPaymentOrder } from '@/lib/cashfree';
import { useToast } from '@/hooks/use-toast';

export default function Credits() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (packageId: string) => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'Please sign in to purchase credits',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
      if (!pkg) return;

      const orderId = `order_${Date.now()}`;
      const order = await createPaymentOrder({
        orderId,
        amount: pkg.amount,
        customerName: session.user.name!,
        customerEmail: session.user.email!,
      });

      // Initialize Cashfree payment
      const cashfree = new window.Cashfree({
        mode: 'sandbox',
      });

      await cashfree.init({
        orderToken: order.order_token,
        onSuccess: async (data: any) => {
          // Update user credits in database
          await fetch('/api/credits/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: session.user.id,
              credits: pkg.credits,
              orderId: data.orderId,
            }),
          });

          toast({
            title: 'Success',
            description: `Successfully purchased ${pkg.credits} credits!`,
          });
        },
        onFailure: (data: any) => {
          toast({
            title: 'Error',
            description: 'Payment failed. Please try again.',
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Purchase Credits</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card key={pkg.id} className="p-6">
            <h2 className="text-2xl font-bold mb-2">{pkg.description}</h2>
            <p className="text-4xl font-bold mb-4">₹{pkg.amount}</p>
            <p className="text-muted-foreground mb-6">{pkg.credits} Credits</p>
            <Button
              className="w-full"
              onClick={() => handlePurchase(pkg.id)}
              disabled={loading}
            >
              Purchase
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}