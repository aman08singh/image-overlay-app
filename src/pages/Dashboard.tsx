import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { useToast } from '@/components/ui/use-toast';

interface ProcessedImage {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/images?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setImages(data);
          setLoading(false);
        });
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/images/${id}`, { method: 'DELETE' });
      setImages(images.filter(img => img.id !== id));
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Processed Images</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <img
              src={image.imageUrl}
              alt="Processed"
              className="w-full aspect-video object-cover"
            />
            <div className="p-4 flex justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(image.imageUrl)}
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}