import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const { mutate: generateImage, isPending } = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await apiRequest("POST", "/api/generate", { prompt });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Image generated!",
        description: "Your AI image has been created successfully.",
      });
      setPrompt("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    generateImage(prompt);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">AI Image Generator</h1>
          <p className="text-muted-foreground mb-8">
            Enter a prompt and let AI create stunning visuals
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              className="text-lg"
              disabled={isPending}
            />
            <Button 
              type="submit" 
              size="lg" 
              disabled={isPending || !prompt.trim()}
              className="w-full md:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </form>

          {isPending && (
            <Card className="mt-8 p-6">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <div className="text-center">
                  <p className="font-medium">Creating your image</p>
                  <p className="text-sm text-muted-foreground">
                    This may take a few moments...
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
