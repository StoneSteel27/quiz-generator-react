import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Basic styling for markdown elements since Tailwind Typography plugin is not available via default CDN
const markdownComponents: any = { // Using `any` for props as ReactMarkdown component types can be complex
  h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold my-2 sm:my-4" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-xl font-bold my-1.5 sm:my-3" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-lg font-bold my-1 sm:my-2" {...props} />,
  p: ({node, ...props}: any) => <p className="my-1 sm:my-2" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc list-inside my-1 sm:my-2 space-y-0.5 sm:space-y-1" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-inside my-1 sm:my-2 space-y-0.5 sm:space-y-1" {...props} />,
  li: ({node, ...props}: any) => <li className="my-0.5 sm:my-1" {...props} />,
  code: ({node, inline, ...props}: any) => {
    if (inline) {
      return <code className="bg-slate-700/50 text-cyan-300 rounded-sm px-1.5 py-0.5 font-mono text-sm" {...props} />;
    }
    // For code blocks, we let `pre` handle the styling.
    // The `react-markdown` library will wrap a `code` element in a `pre` element for code blocks.
    // We reset some styles here to avoid conflicts.
    return <code className="!bg-transparent !p-0" {...props} />;
  },
  pre: ({node, ...props}: any) => <pre className="bg-slate-900/70 p-3 rounded-lg overflow-x-auto text-sm my-1 sm:my-2" {...props} />,
  a: ({node, ...props}: any) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors underline" />,
  blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-slate-600 pl-4 my-2 sm:my-4 italic text-slate-400" {...props} />,
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;