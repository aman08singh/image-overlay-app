import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ImageIcon, Wand2 } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl space-y-8">
        <div className="flex justify-center">
          <ImageIcon className="h-16 w-16" />
        </div>
        <h1 className="text-4xl font-bold">Transform Your Images with AI</h1>
        <p className="text-xl text-muted-foreground">
          Remove backgrounds, add custom text overlays, and create stunning visuals in seconds.
        </p>
        <div className="flex gap-4 justify-center">
          {session ? (
            <Link to="/editor">
              <Button size="lg" className="gap-2">
                <Wand2 className="h-5 w-5" />
                Start Creating
              </Button>
            </Link>
          ) : (
            <Link to="/auth/signin">
              <Button size="lg">Sign In to Start</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}