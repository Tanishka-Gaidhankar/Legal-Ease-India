import ReactMarkdown from "react-markdown";

interface MarkdownMessageProps {
    content: string;
    className?: string;
}

/**
 * Renders LLM responses that contain markdown (bold, lists, headings) as
 * properly formatted HTML instead of raw symbols like ** or - on one line.
 */
export default function MarkdownMessage({ content, className = "" }: MarkdownMessageProps) {
    return (
        <div className={`prose prose-sm dark:prose-invert max-w-none leading-relaxed ${className}`}>
            <ReactMarkdown
                components={{
                    // Headings
                    h1: ({ children }) => <h1 className="text-base font-bold mt-2 mb-1">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-sm font-bold mt-2 mb-1">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mt-1 mb-0.5">{children}</h3>,

                    // Paragraphs
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,

                    // Bold
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,

                    // Ordered list (1. 2. 3.)
                    ol: ({ children }) => (
                        <ol className="list-decimal list-outside ml-4 space-y-0.5 my-1">{children}</ol>
                    ),

                    // Unordered list (- or *)
                    ul: ({ children }) => (
                        <ul className="list-disc list-outside ml-4 space-y-0.5 my-1">{children}</ul>
                    ),

                    // List items
                    li: ({ children }) => <li className="pl-0.5">{children}</li>,

                    // Blockquote (> text)
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground my-1">
                            {children}
                        </blockquote>
                    ),

                    // Inline code
                    code: ({ children }) => (
                        <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
