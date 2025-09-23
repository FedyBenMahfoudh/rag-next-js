/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";

import { MemoizedReactMarkdown } from "@/components/markdown";
import { CodeBlock } from "@/components/code-block";
import { BotIcon, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { memo } from "react";

interface ChatMessageProps {
  message: { content: string; role: string };
  isStreaming?: boolean;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isStreaming = false,
  ...props
}: ChatMessageProps) {
  const processedContent =
    typeof message.content === "string"
      ? message.content
          .replace(/<think>/g, "\n```think\n")
          .replace(/<\/think>/g, "\n```\n")
      : message.content;

  return (
    <div
      className={cn(
        "group relative mb-4 flex items-start mx-1 sm:mx-5 break-words"
      )}
      {...props}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded-full border shadow",
          message.role === "user"
            ? "bg-background "
            : "bg-primary text-primary-foreground "
        )}
      >
        {message.role === "user" ? <User /> : <BotIcon />}
      </div>
      <div className="ml-2 flex-1 space-y-2 overflow-hidden px-1">
        <div className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words">
          <MemoizedReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              //@ts-ignore
              code({ node, inline, className, children, ...props }) {
                if (className === "language-think") {
                  return (
                    <Accordion type="single" collapsible>
                      <AccordionItem
                        value="item-1"
                        className="bg-accent rounded-xl"
                      >
                        <AccordionTrigger>
                          <span className="animate-pulse">💭 thinking...</span>
                        </AccordionTrigger>
                        <AccordionContent className="bg-accent rounded-b-xl">
                          <div className="bg-accent border border-muted p-4 my-4 text-sm text-muted-foreground shadow-sm">
                            <pre className="bg-accent whitespace-pre-wrap break-words font-mono text-sm p-0 m-0 border-0">
                              <code {...props}>{children}</code>
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                }

                if (children) {
                  const firstChild = children as string;

                  if (firstChild === "▍") {
                    return (
                      <span className="mt-1 animate-pulse cursor-default">
                        ▍
                      </span>
                    );
                  }

                  const modifiedChildren = firstChild.replace("`▍`", "▍");

                  const match = /language-(\w+)/.exec(className || "");

                  //@ts-ignore
                  if (inline || !match || firstChild.split("\n").length === 1) {
                    return (
                      <code
                        className={cn(
                          "rounded-sm px-1 py-0.5 font-mono text-xs text-accent-foreground bg-muted",
                          className
                        )}
                        {...props}
                      >
                        {modifiedChildren}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ""}
                      value={String(modifiedChildren).replace(/\n$/, "")}
                      {...props}
                    />
                  );
                }
                return null;
              },
              h1({ children }) {
                return <h1 className="my-4 text-3xl font-bold">{children}</h1>;
              },
              h2({ children }) {
                return <h2 className="my-4 text-2xl font-bold">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="my-4 text-xl font-bold">{children}</h3>;
              },
              h4({ children }) {
                return <h4 className="my-4 text-lg font-bold">{children}</h4>;
              },
              h5({ children }) {
                return <h5 className="my-4 text-base font-bold">{children}</h5>;
              },
              h6({ children }) {
                return <h6 className="my-4 text-sm font-bold">{children}</h6>;
              },
              ul({ children }) {
                return <ul className="list-disc py-0.5 pl-6">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal py-0.5 pl-6">{children}</ol>;
              },
              li({ children }) {
                return <li className="my-2 last:mb-0">{children}</li>;
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-2 border-zinc-300 pl-4 italic">
                    {children}
                  </blockquote>
                );
              },
              pre({ children }) {
                return (
                  <pre className="rounded-md bg-accent p-4">{children}</pre>
                );
              },
              a({ children, href }) {
                return (
                  <a
                    className="text-blue-500 hover:underline"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                );
              },
              img({ src, alt }) {
                return <img className="rounded-md" src={src} alt={alt} />;
              },
              table({ children }) {
                return (
                  <table className="w-full border-collapse">{children}</table>
                );
              },
              thead({ children }) {
                return <thead className="border-b">{children}</thead>;
              },
              hr() {
                return <hr className="my-4 border-t border-zinc-300" />;
              },
            }}
            {...props}
          >
            {processedContent}
          </MemoizedReactMarkdown>

          {isStreaming && (
            <span className="ml-1 animate-pulse text-xl font-bold text-muted-foreground">
              ▍
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
