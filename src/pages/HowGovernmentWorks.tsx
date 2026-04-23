import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Landmark, Users, Scale, Shield, Landmark as GovernmentIcon, UserCheck, Gavel, Sparkles } from "lucide-react";

const HowGovernmentWorks = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate("/constitution/articles");
    };

    const pillars = [
        {
            title: "Legislative",
            icon: <Landmark className="h-10 w-10 text-orange-600" />,
            role: "The Law Makers",
            description: "Responsible for making and amending laws. In India, this is the Parliament (Sansad).",
            bodies: ["Lok Sabha (House of the People)", "Rajya Sabha (Council of States)"],
            powers: ["Policy Making", "Budget Approval", "Law Creation"],
            fact: "India has the longest written Constitution in the world, with over 146,000 words in its English version!",
            color: "border-orange-200 bg-orange-50/50"
        },
        {
            title: "Executive",
            icon: <UserCheck className="h-10 w-10 text-blue-600" />,
            role: "The Law Enforcers",
            description: "Responsible for implementing and enforcing laws made by the legislature.",
            bodies: ["President", "Vice President", "Prime Minister & Cabinet"],
            powers: ["Law Implementation", "Daily Governance", "Foreign Policy"],
            fact: "The Executive can pass 'Ordinances' when Parliament is not in session, allowing for swift action in emergencies.",
            color: "border-blue-200 bg-blue-50/50"
        },
        {
            title: "Judiciary",
            icon: <Gavel className="h-10 w-10 text-green-600" />,
            role: "The Law Interpreters",
            description: "Responsible for interpreting laws and ensuring justice is served as per the Constitution.",
            bodies: ["Supreme Court", "High Courts", "District Courts"],
            powers: ["Conflict Resolution", "Constitutional Guard", "Protecting Rights"],
            fact: "Citizens can directly petition the Supreme Court under Article 32 if their Fundamental Rights are violated—it's called the 'Heart and Soul' of the Constitution.",
            color: "border-green-200 bg-green-50/50"
        }
    ];

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <Button onClick={goBack} variant="outline" className="w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Articles
                    </Button>
                </div>

                <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 tracking-tight">
                        🏛️ How Government Works
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        The Indian Democracy stands on three strong pillars. They work independently but keep each other in check to ensure fair governance.
                    </p>
                </div>

                {/* Pillars Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {pillars.map((pillar, index) => (
                        <Card key={index} className={`border-2 transition-all hover:shadow-lg ${pillar.color}`}>
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto mb-4 bg-white p-4 rounded-2xl shadow-sm border border-border/50">
                                    {pillar.icon}
                                </div>
                                <CardTitle className="text-2xl font-bold">{pillar.title}</CardTitle>
                                <p className="text-primary font-semibold uppercase tracking-wider text-sm">
                                    {pillar.role}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-muted-foreground text-center italic">
                                    "{pillar.description}"
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
                                            <Users className="h-4 w-4" /> Key Bodies
                                        </h4>
                                        <ul className="grid gap-1">
                                            {pillar.bodies.map((body, i) => (
                                                <li key={i} className="text-sm py-1 px-3 bg-white/50 rounded-lg border border-border/30">
                                                    {body}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
                                            <Shield className="h-4 w-4" /> Primary Powers
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {pillar.powers.map((power, i) => (
                                                <span key={i} className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 bg-background border border-border rounded">
                                                    {power}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border/30">
                                        <div className="bg-white/40 p-3 rounded-xl border border-dashed border-primary/20">
                                            <h5 className="text-[11px] font-black uppercase text-primary/60 mb-1 flex items-center gap-1">
                                                <Sparkles className="h-3 w-3" /> Did You Know?
                                            </h5>
                                            <p className="text-xs text-muted-foreground leading-snug">
                                                {pillar.fact}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Checks and Balances */}
                <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="p-8 md:p-12 space-y-6">
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <Scale className="h-8 w-8 text-orange-400" />
                                Checks and Balances
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                No single pillar has absolute power. They monitor each other to ensure the Constitution is followed and nobody abuses their authority.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-800 p-2 rounded-lg">✅</div>
                                    <p><span className="text-orange-400 font-bold">Judiciary</span> can strike down laws passed by <span className="text-blue-400 font-bold">Legislative</span> if they are unconstitutional.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-800 p-2 rounded-lg">✅</div>
                                    <p><span className="text-blue-400 font-bold">Legislative</span> can remove judges through impeachment.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-800 p-2 rounded-lg">✅</div>
                                    <p><span className="text-green-400 font-bold">Executive</span> appoints the judges, but cannot control their decisions.</p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center justify-center bg-slate-800 p-12">
                            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                                {/* Minimalist SVG Diagram placeholder - in a real app would be a complex SVG */}
                                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[300px]">
                                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(251, 146, 60, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
                                    <circle cx="100" cy="40" r="25" fill="#f97316" />
                                    <circle cx="40" cy="140" r="25" fill="#3b82f6" />
                                    <circle cx="160" cy="140" r="25" fill="#22c55e" />
                                    <text x="100" y="45" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">LEG</text>
                                    <text x="40" y="145" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">EXE</text>
                                    <text x="160" y="145" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">JUD</text>
                                    <path d="M100 65 L60 120" stroke="white" strokeWidth="2" markerEnd="url(#arrow)" />
                                    <path d="M140 140 L65 140" stroke="white" strokeWidth="2" markerEnd="url(#arrow)" />
                                    <path d="M140 120 L100 65" stroke="white" strokeWidth="2" markerEnd="url(#arrow)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default HowGovernmentWorks;
