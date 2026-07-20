import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';

export function MarkdownRenderer({ text }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || '');
          if (inline) {
            return (
              <code className="px-1 py-0.5 rounded bg-hairline-border text-body">
                {children}
              </code>
            );
          }
          return (
            <CodeBlock
              language={match ? match[1] : ''}
              value={String(children).replace(/\n$/, '')}
            />
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
