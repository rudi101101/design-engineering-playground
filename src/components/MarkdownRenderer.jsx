import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';

export function MarkdownRenderer({ text }) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children }) {
          return (
            <code className="px-1 py-0.5 rounded bg-hairline-border text-body">
              {children}
            </code>
          );
        },
        pre({ children }) {
          // children is the code element itself (React element)
          const className = children?.props?.className || '';
          const match = /language-(\w+)/.exec(className);
          const value = String(children?.props?.children ?? '').replace(/\n$/, '');
          return (
            <CodeBlock language={match ? match[1] : ''} value={value} />
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
