import { useState, useRef, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
    Send, Upload, FileText, Bot, User, Loader2, Sparkles, RefreshCcw,
    FileImage, File
} from "lucide-react";
import { uploadDocument, summarizeDocument, askDocumentQuestion } from "@/lib/api";
import MarkdownMessage from "@/components/MarkdownMessage";

// ─── Supported file types ─────────────────────────────────────────────────────
const ACCEPTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/webp",
];

const ACCEPT_STRING = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp";

// ─── File badge helper ────────────────────────────────────────────────────────
function getFileBadge(mime: string) {
    if (mime === "application/pdf") return { label: "PDF", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    if (mime.includes("wordprocessingml") || mime === "application/msword")
        return { label: "DOCX", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    if (mime === "text/plain") return { label: "TXT", color: "bg-green-500/20 text-green-400 border-green-500/30" };
    if (mime.startsWith("image/")) return { label: "IMG", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
    return { label: "FILE", color: "bg-muted text-muted-foreground" };
}

function getFileIcon(mime: string) {
    if (mime.startsWith("image/")) return <FileImage className="h-5 w-5" />;
    if (mime === "application/pdf") return <FileText className="h-5 w-5 text-red-400" />;
    if (mime.includes("word") || mime === "application/msword") return <File className="h-5 w-5 text-blue-400" />;
    return <FileText className="h-5 w-5" />;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DocumentSummarizer() {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [documentText, setDocumentText] = useState("");
    const [filename, setFilename] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState("");
    const [documentId, setDocumentId] = useState("");

    const [question, setQuestion] = useState("");
    const [isAsking, setIsAsking] = useState(false);

    type Message = { role: "user" | "assistant"; content: string };
    const [chatHistory, setChatHistory] = useState<Message[]>([]);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isAsking]);

    // ── File selection logic ──────────────────────────────────────────────────
    const processFile = useCallback((file: File) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            toast({
                title: "Unsupported file type",
                description: "Please upload a PDF, Word document (.doc/.docx), plain text (.txt), or an image (JPG/PNG).",
                variant: "destructive",
            });
            return;
        }

        setSelectedFile(file);
        setFilename(file.name);
        setDocumentText(""); // clear paste area when a file is chosen

        // For plain text files, read locally so the paste area still works
        if (file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = (e) => setDocumentText((e.target?.result as string) ?? "");
            reader.readAsText(file);
        }
    }, [toast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    // ── Summarize ─────────────────────────────────────────────────────────────
    const handleSummarize = async () => {
        setIsSummarizing(true);
        setSummary("");
        setChatHistory([]);

        try {
            let res: { summary: string; documentId: string; filename?: string } | null = null;

            if (selectedFile && selectedFile.type !== "text/plain") {
                // Send file to backend for extraction + summarization
                res = await uploadDocument(selectedFile);
            } else {
                // Use the text pasted / read from txt file
                if (documentText.trim().length < 50) {
                    toast({
                        title: "Text too short",
                        description: "Please provide a longer document for meaningful summarization.",
                        variant: "destructive",
                    });
                    setIsSummarizing(false);
                    return;
                }
                res = await summarizeDocument(documentText, filename || "Pasted Document");
            }

            if (res?.summary) {
                setSummary(res.summary);
                setDocumentId(res.documentId);
                toast({ title: "Document Summarized", description: "Your document is ready for questions." });
                setChatHistory([{ role: "assistant", content: "I've read and summarized this document. Feel free to ask me any questions about it!" }]);
            }
        } catch (error: any) {
            toast({
                title: "Error Processing Document",
                description: error.message || "Failed to process the document.",
                variant: "destructive",
            });
        } finally {
            setIsSummarizing(false);
        }
    };

    // ── Reset ─────────────────────────────────────────────────────────────────
    const handleReset = () => {
        setDocumentText("");
        setFilename("");
        setSelectedFile(null);
        setSummary("");
        setDocumentId("");
        setChatHistory([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── Q & A ─────────────────────────────────────────────────────────────────
    const handleAskQuestion = async () => {
        if (!question.trim() || !documentId) return;

        const userMsg: Message = { role: "user", content: question.trim() };
        setChatHistory(prev => [...prev, userMsg]);
        setQuestion("");
        setIsAsking(true);

        try {
            const answer = await askDocumentQuestion(documentId, userMsg.content, chatHistory);
            setChatHistory(prev => [...prev, { role: "assistant", content: answer }]);
        } catch (error: any) {
            toast({ title: "Error answering", description: error.message || "Could not retrieve an answer.", variant: "destructive" });
            setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error trying to answer that." }]);
        } finally {
            setIsAsking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAskQuestion();
        }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const canSummarize =
        !isSummarizing &&
        (
            (selectedFile !== null && selectedFile.type !== "text/plain") ||
            documentText.trim().length > 0
        );

    const badge = selectedFile ? getFileBadge(selectedFile.type) : null;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* ── Page Header ── */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">
                            <FileText className="h-8 w-8 text-primary" />
                            Document Summarizer &amp; QA
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Upload a legal document — PDF, Word, image, or plain text — get an instant AI summary, then ask questions about it.
                        </p>

                        {/* Supported formats badge row */}
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {[
                                { label: "PDF", color: "bg-red-500/10 text-red-400 border-red-500/20" },
                                { label: "DOCX / DOC", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                                { label: "TXT", color: "bg-green-500/10 text-green-400 border-green-500/20" },
                                { label: "JPG / PNG", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                            ].map(b => (
                                <span key={b.label} className={`px-3 py-0.5 rounded-full text-xs border font-medium ${b.color}`}>
                                    {b.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Upload Panel ── */}
                    {!documentId ? (
                        <Card className="p-6 md:p-8 max-w-3xl mx-auto bg-card shadow-lg border-primary/10">
                            <div className="flex flex-col gap-6">

                                <div>
                                    <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                                        <Upload className="h-5 w-5" />
                                        1. Upload or Paste Document
                                    </h2>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Drag &amp; drop a file here, click to browse, or paste text directly below.
                                    </p>

                                    {/* ── Drop Zone ── */}
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                                            relative flex flex-col items-center justify-center
                                            border-2 border-dashed rounded-xl p-8 mb-4 cursor-pointer
                                            transition-all duration-200
                                            ${isDragging
                                                ? "border-primary bg-primary/10 scale-[1.01]"
                                                : "border-border/60 hover:border-primary/60 hover:bg-muted/40"
                                            }
                                        `}
                                    >
                                        <input
                                            type="file"
                                            accept={ACCEPT_STRING}
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />

                                        {selectedFile ? (
                                            <div className="flex flex-col items-center gap-2 text-center">
                                                {getFileIcon(selectedFile.type)}
                                                <div className="flex items-center gap-2 mt-1">
                                                    {badge && (
                                                        <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${badge.color}`}>
                                                            {badge.label}
                                                        </span>
                                                    )}
                                                    <span className="text-sm font-medium text-foreground truncate max-w-xs">
                                                        {selectedFile.name}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {(selectedFile.size / 1024).toFixed(1)} KB · Click to replace
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-center">
                                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Upload className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        Drop file here or <span className="text-primary underline underline-offset-2">click to browse</span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        PDF, DOCX, DOC, TXT, JPG, PNG &nbsp;·&nbsp; Max 20 MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Divider ── */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                                        <div className="flex-1 h-px bg-border" />
                                        <span>or paste text directly</span>
                                        <div className="flex-1 h-px bg-border" />
                                    </div>

                                    <Textarea
                                        value={documentText}
                                        onChange={(e) => {
                                            setDocumentText(e.target.value);
                                            if (e.target.value && selectedFile?.type !== "text/plain") {
                                                setSelectedFile(null);
                                                setFilename("");
                                            }
                                        }}
                                        placeholder="Paste legal document text here… (minimum 50 characters)"
                                        className="min-h-[180px] resize-y"
                                    />
                                </div>

                                <div className="flex justify-between items-center">
                                    {(selectedFile || documentText) && (
                                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                                            <RefreshCcw className="h-4 w-4 mr-2" /> Clear
                                        </Button>
                                    )}
                                    <div className="ml-auto">
                                        <Button
                                            onClick={handleSummarize}
                                            disabled={!canSummarize}
                                            className="flex gap-2 min-w-[140px]"
                                        >
                                            {isSummarizing ? (
                                                <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                                            ) : (
                                                <><Sparkles className="h-4 w-4" /> Summarize</>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </Card>
                    ) : (
                        /* ── Summary + Chat Columns ── */
                        <div className="grid md:grid-cols-2 gap-6 h-auto min-h-[600px]">

                            {/* Left — Summary */}
                            <Card className="flex flex-col h-full bg-card shadow">
                                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Document Summary
                                        {filename && (
                                            <span className="ml-2 text-xs font-normal text-muted-foreground truncate max-w-[140px]">
                                                ({filename})
                                            </span>
                                        )}
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                                        <RefreshCcw className="h-4 w-4 mr-2" /> New Document
                                    </Button>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1">
                                    <MarkdownMessage content={summary} />
                                </div>
                            </Card>

                            {/* Right — Q&A */}
                            <Card className="flex flex-col h-full bg-card shadow">
                                <div className="p-4 border-b border-border bg-muted/50">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <Bot className="h-5 w-5 text-primary" />
                                        Ask Questions
                                    </h3>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            {msg.role === "assistant" && (
                                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                                    <Bot className="h-4 w-4 text-primary-foreground" />
                                                </div>
                                            )}
                                            <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                                                {msg.role === "assistant" ? (
                                                    <MarkdownMessage content={msg.content} />
                                                ) : (
                                                    msg.content
                                                )}
                                            </div>
                                            {msg.role === "user" && (
                                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                                    <User className="h-4 w-4 text-secondary-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {isAsking && (
                                        <div className="flex justify-start">
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                                <Bot className="h-4 w-4 text-primary-foreground" />
                                            </div>
                                            <div className="ml-3 bg-muted rounded-lg px-4 py-3 flex items-center">
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="p-3 border-t border-border">
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Ask a question about the document…"
                                            className="resize-none min-h-[50px] max-h-[150px]"
                                            rows={2}
                                            disabled={isAsking}
                                        />
                                        <Button onClick={handleAskQuestion} disabled={isAsking || !question.trim()} className="h-auto">
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
