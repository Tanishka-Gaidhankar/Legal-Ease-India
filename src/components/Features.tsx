import { Scale, BookOpen, FileText, Lightbulb } from "lucide-react";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      icon: Scale,
      title: "Legal Chatbot",
      description:
        "Ask legal questions, get document help, and receive clear, reliable answers with citations in a professional chat interface.",
      buttonText: "Start Legal Query",
      buttonLink: "/legal-help",
    },
    {
      icon: BookOpen,
      title: "Constitutional Section",
      description:
        "Explore the Indian Constitution through simple explanations, stories, and interactive tools that make rights and duties easy to understand.",
      buttonText: "Explore Constitution",
      buttonLink: "/constitution/articles",
    },
    {
      icon: FileText,
      title: "Document Summarizer",
      description:
        "Upload complex legal documents and get visual flowchart summaries that break down dense legal language into digestible insights.",
      buttonText: "Summarize Documents",
      buttonLink: "/document-summarizer",
    },
    {
      icon: Lightbulb,
      title: "What If Scenarios",
      description:
        "Explore 'What Happens If...' scenario guides for civic awareness. Learn the legal implications of everyday situations.",
      buttonText: "Explore Scenarios",
      buttonLink: "/constitution/what-happens-if",
    },
  ];

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="bg-muted/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What we provide
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
