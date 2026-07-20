import { useState } from 'react';

export function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-button bg-ink overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-black/20">
        <span className="text-caption font-semibold text-slate-gray uppercase">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="text-caption font-semibold text-pure-white/70 hover:text-pure-white"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-body text-pure-white">
        <code>{value}</code>
      </pre>
    </div>
  );
}
