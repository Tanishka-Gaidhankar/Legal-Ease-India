import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { analyzeScenario } from "@/lib/api";

interface Scenario {
    id: number;
    title: string;
    explanation: string;
    consequences: string[];
    relatedArticles: number[];
}

const WhatHappensIf = () => {
    const navigate = useNavigate();
    const [allScenarios, setAllScenarios] = useState<Scenario[]>([]);
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [customInput, setCustomInput] = useState("");
    const [customResult, setCustomResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadScenarios();
    }, []);

    const loadScenarios = async () => {
        try {
            const response = await fetch("/scenarios.json");
            const data: Scenario[] = await response.json();
            setAllScenarios(data);
            if (data.length > 0) {
                setSelectedScenario(data[0]);
            }
        } catch (err) {
            console.error("Failed to load scenarios:", err);
            loadSampleScenarios();
        }
    };

    const loadSampleScenarios = () => {
        const sampleData: Scenario[] = [
            {
                id: 1,
                title: "What happens if I break a traffic rule?",
                explanation:
                    "Traffic rules exist to ensure the safety of all road users. Breaking them can result in penalties, fines, and in serious cases, legal action.",
                consequences: [
                    "Fine as per Motor Vehicles Act",
                    "License suspension or cancellation",
                    "Vehicle impounding in severe cases",
                ],
                relatedArticles: [21, 19, 14],
            },
            {
                id: 3,
                title: "What happens if I'm arrested without a warrant?",
                explanation:
                    "The Constitution provides protection against arbitrary arrest. Police cannot arrest anyone without proper legal procedure and reasonable cause.",
                consequences: [
                    "Violation of Article 22 rights",
                    "Unlawful detention claim can be filed",
                    "Habeas corpus petition to challenge arrest",
                ],
                relatedArticles: [22, 21, 20],
            },
        ];
        setAllScenarios(sampleData);
        setSelectedScenario(sampleData[0]);
    };

    const handleScenarioClick = (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setCustomResult(null);
    };

    const goToArticle = (articleNum: number) => {
        localStorage.setItem("selectedArticleId", String(articleNum));
        navigate("/constitution/article-detail");
    };

    const handleCustomScenario = async () => {
        if (!customInput.trim()) {
            setError("Please enter a scenario.");
            return;
        }

        setLoading(true);
        setError(null);
        setCustomResult(null);

        try {
            const result = await analyzeScenario(customInput);
            setCustomResult(result);
        } catch (err) {
            console.error("Failed to analyze scenario:", err);
            setError("I'm having trouble analyzing this scenario right now. Please make sure the backend server is running and your Cohere API key is valid.");
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate("/constitution/articles");
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 md:p-8 mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        ⚖️ What Happens If...
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        Explore real-world scenarios and understand the legal consequences.
                    </p>
                    <Button onClick={goBack} variant="secondary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Constitutional Section
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Scenarios List (Left) */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>📋 Common Scenarios</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {allScenarios.map((scenario) => (
                                    <Button
                                        key={scenario.id}
                                        variant={selectedScenario?.id === scenario.id ? "default" : "outline"}
                                        className="w-full text-left justify-start h-auto py-3 px-4"
                                        onClick={() => handleScenarioClick(scenario)}
                                    >
                                        {scenario.title}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detail Panel (Right) */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedScenario && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">{selectedScenario.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Explanation */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                                                📝 Explanation
                                            </h3>
                                            <p className="text-foreground leading-relaxed">
                                                {selectedScenario.explanation}
                                            </p>
                                        </div>

                                        {/* Legal Consequences */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                                                ⚠️ Legal Consequences
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedScenario.consequences.map((consequence, index) => (
                                                    <li key={index} className="flex gap-3">
                                                        <span className="text-primary font-bold">▸</span>
                                                        <span className="text-foreground">{consequence}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Related Articles */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                                                🔗 Related Articles
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedScenario.relatedArticles.map((articleNum) => (
                                                    <Badge
                                                        key={articleNum}
                                                        variant="secondary"
                                                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                                        onClick={() => goToArticle(articleNum)}
                                                    >
                                                        Article {articleNum}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Custom Scenario Input */}
                        <Card>
                            <CardHeader>
                                <CardTitle>❓ Ask Your Own Scenario</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Can't find your scenario? Ask a custom question and our AI will analyze it
                                    for you.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Example: What happens if I am not allowed to speak my own language in a government office?"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    className="min-h-[100px]"
                                />
                                <Button
                                    onClick={handleCustomScenario}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        "Get AI Analysis"
                                    )}
                                </Button>

                                {error && (
                                    <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {customResult && (
                                    <div className="bg-primary/10 border border-primary p-4 rounded-lg">
                                        <strong className="text-primary">🤖 AI Analysis:</strong>
                                        <div className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground">
                                            {customResult}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default WhatHappensIf;
