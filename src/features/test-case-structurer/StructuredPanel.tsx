import { useMemo } from 'react';
import { CodePanel } from '../../components/CodePanel';
import { useAppStore } from '../../store/appStore';

export const StructuredPanel = () => {
  const structured = useAppStore((state) => state.structuredTestCaseJson);

  const content = useMemo(() => (structured ? JSON.stringify(structured, null, 2) : ''), [structured]);

  return (
    <CodePanel
      title="Stage 2: Structured Test Case JSON"
      content={content}
      onCopy={() => void navigator.clipboard.writeText(content)}
      emptyText="Normalized structured JSON will appear here after Stage 2."
    />
  );
};
