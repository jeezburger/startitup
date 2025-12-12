"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
            );
            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) textarea.style.height = `${minHeight}px`;
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

export function VercelV0Chat() {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 60, maxHeight: 200 });

    const handleSubmit = async () => {
        if (!value.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: value.trim() }),
            });

            if (!res.ok) {
                console.error("Failed to submit idea");
            } else {
                setValue("");
                adjustHeight(true);
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 2000); // hide after 2s
            }
        } catch (err) {
            console.error("Error submitting idea:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 space-y-2 relative">
            <div className="w-full relative bg-neutral-900 rounded-xl border border-neutral-800 p-3 hover:bg-neutral-800 transition-colors">
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        adjustHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Make your idea come alive"
                    style={{ fontFamily: "var(--font-geist-sans)", overflowY: "auto" }}
                    className={cn(
                        "w-full resize-none bg-transparent border-none text-white text-lg",
                        "focus:outline-none placeholder:text-neutral-500 min-h-[60px] max-h-[200px]"
                    )}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading || !value.trim()}
                    className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1 px-3 py-2 rounded-full transition-all",
                        "bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400"
                    )}
                >
                    <ArrowUpIcon className="w-4 h-4" />
                </button>

                {/* Toast popup at the bottom */}
                <div
                    className={cn(
                        "absolute left-1/2 -translate-x-1/2 bottom-[-50px] bg-white text-black text-lg font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out",
                        submitted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4 pointer-events-none"
                    )}
                >
                    Idea submitted!
                </div>
            </div>
        </div>
    );
}
