import { CodePanel } from '../../components/CodePanel';
import { useAppStore } from '../../store/appStore';

export const RpgPanel = () => {
  const content = useAppStore((state) => state.generatedRpgCode);

  return (
    <CodePanel
      title="Stage 3: Generated RPGLE Code"
      content={content}
      onCopy={() => void navigator.clipboard.writeText(content)}
      emptyText="Generated RPG test program will appear here after Stage 3."
    />
  );
};
