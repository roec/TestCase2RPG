import { useMemo } from 'react';
import { CodePanel } from '../../components/CodePanel';
import { useAppStore } from '../../store/appStore';

export const ParsedPanel = () => {
  const parsed = useAppStore((state) => state.parsedDescription);

  const content = useMemo(() => (parsed ? JSON.stringify(parsed, null, 2) : ''), [parsed]);

  return (
    <CodePanel
      title="Stage 1: Parsed Description"
      content={content}
      onCopy={() => void navigator.clipboard.writeText(content)}
      emptyText="Parsed output will appear here after Stage 1."
    />
  );
};
