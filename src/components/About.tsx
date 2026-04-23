import { CheckCircle } from "lucide-react";

const About = () => {
  const benefits = [
    "Clear explanations of complex legal terminology",
    "Interactive exploration of fundamental rights and duties",
    "Visual flowcharts for document summarization",
    "Scenario-based learning for civic awareness",
    "Accessible across languages and education levels",
    "Reliable, unbiased legal information",
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Bridging the Gap in Legal Accessibility
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Understanding Indian law shouldn't be reserved for legal professionals. 
              LegalEase India leverages modern AI and interactive technologies to make 
              the Indian Constitution accessible to everyone—students, professionals, 
              and citizens alike.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Our platform transforms dense legal documents into clear, actionable 
              insights, helping you understand your rights, duties, and legal procedures 
              with confidence.
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 lg:p-12">
            <blockquote className="text-xl md:text-2xl font-serif text-foreground italic leading-relaxed">
              "We the people of India, having solemnly resolved to constitute India 
              into a Sovereign Socialist Secular Democratic Republic and to secure 
              to all its citizens..."
            </blockquote>
            <p className="mt-6 text-muted-foreground font-medium">
              — Preamble to the Constitution of India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
