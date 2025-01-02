import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SignIn() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome Back</h1>
        <Button
          className="w-full"
          onClick={() => signIn('google')}
        >
          Continue with Google
        </Button>
      </Card>
    </div>
  );
}