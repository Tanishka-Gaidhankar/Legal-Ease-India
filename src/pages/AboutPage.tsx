import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Users, Zap, Shield } from "lucide-react";

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Accessibility",
      description: "Making legal knowledge available to everyone, regardless of background",
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "Providing accurate, unbiased information from trusted sources",
    },
    {
      icon: Zap,
      title: "Simplicity",
      description: "Transforming complex legal language into clear, actionable insights",
    },
    {
      icon: Users,
      title: "Inclusivity",
      description: "Serving diverse communities across languages and education levels",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            About LegalEase India
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Empowering citizens with accessible legal knowledge through AI-powered tools and interactive education
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                To democratize legal knowledge by making the Indian Constitution and legal procedures accessible, understandable, and actionable for every citizen. We believe that understanding one's rights and duties is the foundation of an empowered democracy.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-secondary/20 rounded-lg">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                A nation where every citizen, regardless of their educational background or linguistic preference, has instant access to clear, reliable legal information. Where understanding the Constitution becomes as natural as knowing one's mother tongue.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Problem & Solution */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            The Challenge We Address
          </h2>
          <div className="bg-card rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">The Problem</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Complex legal language creates barriers to understanding</li>
                  <li>• 470+ articles in the Constitution can be overwhelming</li>
                  <li>• Limited access to reliable legal guidance</li>
                  <li>• Language and educational divides widen the gap</li>
                  <li>• Lengthy legal documents discourage engagement</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Our Solution</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• AI-powered chatbot for instant legal guidance</li>
                  <li>• Interactive exploration of constitutional articles</li>
                  <li>• Visual flowcharts simplify complex documents</li>
                  <li>• Multi-lingual support for broader accessibility</li>
                  <li>• Scenario-based learning for practical awareness</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
