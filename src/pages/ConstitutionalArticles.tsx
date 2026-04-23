import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Landmark as GovernmentIcon } from "lucide-react";

interface Article {
  id?: number;
  article: number | string;
  title: string;
  description: string;
  part: string;
  simpleExplanation?: string;
  realLifeExample?: string;
  keywords?: string[];
}

const ConstitutionalArticles = () => {
  const navigate = useNavigate();
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState<string>("all");
  const [parts, setParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  // Inline filter logic directly in the effect to avoid stale closure issues
  useEffect(() => {
    if (allArticles.length === 0) return;

    const query = searchQuery.toLowerCase().trim();

    const filtered = allArticles.filter((article) => {
      const matchSearch =
        !query ||
        String(article.article).toLowerCase().includes(query) ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        (article.keywords &&
          article.keywords.some((kw) =>
            kw.toLowerCase().includes(query)
          ));

      const matchPart = selectedPart === "all" || article.part === selectedPart;

      return matchSearch && matchPart;
    });

    setFilteredArticles(filtered);
  }, [searchQuery, selectedPart, allArticles]);

  const loadArticles = async () => {
    try {
      const response = await fetch("/constitution_enhanced.json");
      const data = await response.json();
      setAllArticles(data);

      // Extract unique parts
      const uniqueParts = Array.from(
        new Set(data.map((article: Article) => article.part).filter(Boolean))
      ).sort();
      setParts(uniqueParts as string[]);

      setLoading(false);
    } catch (error) {
      console.error("Failed to load articles:", error);
      loadSampleData();
    }
  };

  const loadSampleData = () => {
    const sampleData: Article[] = [
      {
        article: 0,
        title: "Preamble",
        description:
          "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC...",
        part: "Preamble",
        simpleExplanation: "This is the opening statement of India's Constitution.",
        realLifeExample: "The Preamble sets the vision and values that guide all the articles.",
        keywords: ["preamble", "sovereign", "democratic", "republic", "justice"],
      },
      {
        article: 1,
        title: "Name and territory of the Union",
        description: "(1) India, that is Bharat, shall be a Union of States.",
        part: "Part I: The Union and Its Territory",
        simpleExplanation: "India is officially called 'Bharat' and is a Union of States.",
        realLifeExample: "When Goa joined India in 1961, its territory was added to the Union.",
        keywords: ["union", "territory", "bharat", "states"],
      },
      {
        article: 14,
        title: "Equality before law",
        description:
          "The State shall not deny to any person in the territory of India equality before the law or the equal protection of the laws.",
        part: "Part III: Fundamental Rights",
        simpleExplanation:
          "All citizens are equal before the law and cannot be discriminated against.",
        realLifeExample: "A person cannot be denied a job because of their religion or caste.",
        keywords: ["equality", "discrimination", "fundamental right"],
      },
      {
        article: 21,
        title: "Protection of life and personal liberty",
        description:
          "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
        part: "Part III: Fundamental Rights",
        simpleExplanation:
          "No person can be deprived of their life or liberty except by legal procedure.",
        realLifeExample: "Police cannot arrest someone without proper legal procedure.",
        keywords: ["life", "liberty", "personal freedom", "due process"],
      },
    ];

    setAllArticles(sampleData);
    const uniqueParts = Array.from(new Set(sampleData.map((a) => a.part)));
    setParts(uniqueParts);
    setLoading(false);
  };


  const openArticleDetail = (articleNumber: number | string) => {
    localStorage.setItem("selectedArticleId", String(articleNumber));
    navigate("/constitution/article-detail");
  };

  const openWhatHappensIf = () => {
    navigate("/constitution/what-happens-if");
  };

  const openHowGovernmentWorks = () => {
    navigate("/constitution/how-government-works");
  };

  const goToArticle = (articleId: string) => {
    openArticleDetail(articleId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 md:p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            📖 Constitutional Section
          </h1>
          {/* Quick Access Section */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { id: "14", title: "Equality", icon: "⚖️" },
              { id: "19", title: "Freedom", icon: "🗣️" },
              { id: "21", title: "Liberty", icon: "🛡️" },
              { id: "21A", title: "Education", icon: "🎓" }
            ].map(card => (
              <Card
                key={card.id}
                onClick={() => goToArticle(card.id)}
                className="p-4 cursor-pointer hover:bg-primary/5 transition-all text-center border-primary/20 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <div className="text-2xl mb-1">{card.icon}</div>
                <div className="text-sm font-bold truncate">Article {card.id}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black">{card.title}</div>
              </Card>
            ))}
          </div>

          {/* Filter and Search */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={openWhatHappensIf} variant="secondary" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              What Happens If…
            </Button>
            <Button
              variant="secondary"
              onClick={openHowGovernmentWorks}
              className="flex items-center gap-2"
            >
              <GovernmentIcon className="h-4 w-4" />
              How Government Works
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Input
              type="text"
              placeholder="Search by article number, title, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm">Filter by Part:</span>
              <Select value={selectedPart} onValueChange={setSelectedPart}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="All Parts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parts</SelectItem>
                  {parts.map((part) => (
                    <SelectItem key={part} value={part}>
                      {part}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Article List */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading articles..."
              : `Showing ${filteredArticles.length} article(s)`}
          </p>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Part</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    Loading articles...
                  </TableCell>
                </TableRow>
              ) : filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No articles found. Try a different search or filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article, index) => (
                  <TableRow
                    key={article.id !== undefined ? article.id : `${article.article}-${index}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openArticleDetail(article.article)}
                  >
                    <TableCell className="font-semibold text-primary">
                      Article {article.article}
                    </TableCell>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {article.part}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default ConstitutionalArticles;
