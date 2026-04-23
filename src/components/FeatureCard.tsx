import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonLink,
}: FeatureCardProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      <Button
        asChild
        variant="outline"
        className="font-semibold"
      >
        <Link to={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  );
};

export default FeatureCard;
