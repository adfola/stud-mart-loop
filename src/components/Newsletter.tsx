import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-16 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get<br />Our New Stuff?
          </h2>
          <p className="text-background/80 mb-6">
            Subscribe to our newsletter and be the first to know about new products, exclusive deals, and campus market updates.
          </p>
          <div className="flex gap-3 max-w-md">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
              <Input
                type="email"
                placeholder="Your Email"
                className="pl-10 bg-background text-foreground h-12"
              />
            </div>
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 h-12 px-8">
              Send
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
