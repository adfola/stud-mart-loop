import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HeroSection = () => {
  return (
    <section className="relative bg-hero-gradient py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            Shop
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find everything you need for campus life
          </p>
          
          {/* Hero Search */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search on Campus Market"
                  className="pl-12 h-14 text-lg"
                />
              </div>
              <Button size="lg" className="h-14 px-8 text-base font-semibold">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
