import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Heart, Users, Scale, Gavel, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Constitution = () => {
  const fundamentalRights = [
    {
      title: "Right to Equality",
      articles: "14-18",
      description:
        "Ensures equality before law, prohibits discrimination, abolishes untouchability, and forbids titles.",
      icon: Scale,
    },
    {
      title: "Right to Freedom",
      articles: "19-22",
      description:
        "Guarantees freedom of speech, assembly, movement, residence, profession, and protection against arrest.",
      icon: Shield,
    },
    {
      title: "Right Against Exploitation",
      articles: "23-24",
      description:
        "Prohibits human trafficking, forced labor, and child labor in hazardous industries.",
      icon: Users,
    },
    {
      title: "Right to Freedom of Religion",
      articles: "25-28",
      description:
        "Protects freedom of conscience, profession, practice, and propagation of religion.",
      icon: Heart,
    },
    {
      title: "Cultural & Educational Rights",
      articles: "29-30",
      description:
        "Protects interests of minorities and their right to establish educational institutions.",
      icon: BookOpen,
    },
    {
      title: "Right to Constitutional Remedies",
      articles: "32",
      description:
        "Enables citizens to approach courts for enforcement of fundamental rights through writs.",
      icon: Gavel,
    },
  ];

  const fundamentalDuties = [
    "To abide by the Constitution and respect its ideals and institutions",
    "To cherish and follow the noble ideals which inspired our national struggle for freedom",
    "To uphold and protect the sovereignty, unity and integrity of India",
    "To defend the country and render national service when called upon",
    "To promote harmony among all citizens",
    "To preserve the rich heritage of our composite culture",
    "To protect and improve the natural environment",
    "To develop scientific temper, humanism and spirit of inquiry",
    "To safeguard public property and abjure violence",
    "To strive towards excellence in all spheres",
    "To provide education opportunities to children between 6-14 years",
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Indian Constitution
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Explore the fundamental rights, duties, and principles that form the
            backbone of Indian democracy
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/constitution/articles">
              <BookOpen className="mr-2 h-5 w-5" />
              Explore Full Constitution
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="rights" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="rights">Fundamental Rights</TabsTrigger>
            <TabsTrigger value="duties">Fundamental Duties</TabsTrigger>
            <TabsTrigger value="preamble">Preamble</TabsTrigger>
          </TabsList>

          <TabsContent value="rights">
            <div className="grid md:grid-cols-2 gap-6">
              {fundamentalRights.map((right, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <right.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{right.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        Articles {right.articles}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{right.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="duties">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Article 51A - Fundamental Duties
                </CardTitle>
                <p className="text-muted-foreground">
                  Added by the 42nd Amendment in 1976
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <ol className="space-y-4">
                    {fundamentalDuties.map((duty, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <p className="text-foreground pt-1">{duty}</p>
                      </li>
                    ))}
                  </ol>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preamble">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-8 md:p-12">
                <h3 className="text-center text-lg font-semibold text-primary mb-6">
                  PREAMBLE TO THE CONSTITUTION OF INDIA
                </h3>
                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed font-serif text-center">
                  <p className="mb-4">
                    <span className="text-2xl font-bold">WE, THE PEOPLE OF INDIA,</span> having
                    solemnly resolved to constitute India into a{" "}
                    <strong>SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC</strong> and to
                    secure to all its citizens:
                  </p>
                  <p className="mb-4">
                    <strong>JUSTICE,</strong> social, economic and political;
                  </p>
                  <p className="mb-4">
                    <strong>LIBERTY</strong> of thought, expression, belief, faith and worship;
                  </p>
                  <p className="mb-4">
                    <strong>EQUALITY</strong> of status and of opportunity;
                  </p>
                  <p className="mb-4">
                    and to promote among them all{" "}
                    <strong>FRATERNITY</strong> assuring the dignity of the individual and the
                    unity and integrity of the Nation;
                  </p>
                  <p className="mt-8 text-muted-foreground">
                    IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do
                    HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.
                  </p>
                </blockquote>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Constitution;
