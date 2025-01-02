import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { removeBackground } from "@imgly/background-removal";
import { HexColorPicker } from "react-colorful";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
// import { useToast } from "@/components/ui/use-toast";

const fontFamilies = [
  "Arial",
  "Times New Roman",
  "Helvetica",
  "Georgia",
  "Verdana",
  "Courier New",
];

export default function Editor() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState(fontFamilies[0]);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(100);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setProcessing(true);
      try {
        const originalUrl = URL.createObjectURL(file);
        setOriginalImage(originalUrl);
        
        const blob = await removeBackground(file);
        const removedBgUrl = URL.createObjectURL(blob);
        setRemovedBgImage(removedBgUrl);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive",
        });
      }
      setProcessing(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
  });

  const handleProcess = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "Please sign in to process images",
        variant: "destructive",
      });
      return;
    }

    if (session.user.credits < 1 && !session.user.isDev) {
      toast({
        title: "Error",
        description: "Not enough credits. Please purchase more credits.",
        variant: "destructive",
      });
      return;
    }

    // Process image logic here
    // Upload to ImageKit
    // Save to database
    // Deduct credits
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        {!originalImage ? (
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>Drag & drop an image here, or click to select one</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Text Overlay</Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
            />

            <Label>Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Font Size: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={12}
              max={72}
              step={1}
            />

            <Label>Color</Label>
            <HexColorPicker color={color} onChange={setColor} />

            <Label>Opacity: {opacity}%</Label>
            <Slider
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
              min={0}
              max={100}
              step={1}
            />

            <Button
              onClick={handleProcess}
              disabled={processing}
              className="w-full"
            >
              {processing ? "Processing..." : "Process Image"}
            </Button>
          </div>
        )}
      </div>

      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {originalImage && (
          <>
            <img
              src={originalImage}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {removedBgImage && (
              <img
                src={removedBgImage}
                alt="No Background"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily,
                fontSize: `${fontSize}px`,
                color,
                opacity: opacity / 100,
              }}
            >
              {text}
            </div>
          </>
        )}
      </div>
    </div>
  );
}