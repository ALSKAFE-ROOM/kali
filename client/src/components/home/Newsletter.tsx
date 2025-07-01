import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
    }, 1000);
  };

  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">Get Exclusive Offers</h2>
        <p className="max-w-2xl mx-auto mb-8">
          Subscribe to our newsletter and be the first to know about special deals and seasonal discounts on our luxury properties.
        </p>
        <form 
          onSubmit={handleSubmit} 
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
        >
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow bg-white text-neutral-800 border-0"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-secondary hover:bg-secondary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe Now"}
          </Button>
        </form>
      </div>
    </section>
  );
}
