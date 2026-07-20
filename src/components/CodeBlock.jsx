import { useState } from "react";

export default function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-hairline-border bg-ink">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-mono text-[11px] font-semibold text-faint-gray">{language || "text"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-faint-gray transition hover:bg-white/10 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 text-[12.5px] leading-relaxed text-slate-gray">
        <code className="font-mono text-[#e2e8f0]">{code}</code>
      </pre>
    </div>
  );
}
