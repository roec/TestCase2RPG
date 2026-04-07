import { Card } from './Card';

interface CodePanelProps {
  title: string;
  content: string;
  onCopy: () => void;
  emptyText: string;
}

export const CodePanel = ({ title, content, onCopy, emptyText }: CodePanelProps) => (
  <Card className="h-screen">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      <button
        type="button"
        onClick={onCopy}
        disabled={!content}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Copy
      </button>
    </div>
    <pre className="h-[calc(100vh-7rem)] overflow-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-100">
      {content || emptyText}
    </pre>
  </Card>
);
