import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock.jsx";

export default function MarkdownRenderer({ text }) {
  if (!text) return null;
  return (
    <div className="prose-content text-[13.5px] leading-[1.65] text-slate-gray">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            // react-markdown v9 dropped the `inline` prop — detect block code by the
            // `language-xxx` class fenced blocks get instead (absent on inline spans).
            const match = /language-(\w+)/.exec(className || "");
            if (!match) {
              return (
                <code className="rounded bg-indigo-wash px-1.5 py-0.5 font-mono text-[13px] text-indigo-deep" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock language={match[1]}>{children}</CodeBlock>;
          },
          pre({ children }) {
            return <>{children}</>;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
