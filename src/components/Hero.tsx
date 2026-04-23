import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-6 leading-tight">
            Understanding Indian Law,{" "}
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-accent/90 mb-8 leading-relaxed">
            Your AI-powered legal assistant for navigating the Indian Constitution.
            Get clear explanations, explore 470+ articles, and understand your rights
            and duties with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg font-semibold">
              <Link to="/legal-help">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Legal Query
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-lg font-semibold">
              <Link to="/constitution/articles">
                Explore Constitution
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
