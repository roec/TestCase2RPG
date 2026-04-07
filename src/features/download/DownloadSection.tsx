import { Card } from '../../components/Card';
import { useAppStore } from '../../store/appStore';

const FILENAME = 'generated-test-program.rpgle';

export const DownloadSection = () => {
  const code = useAppStore((state) => state.generatedRpgCode);

  const download = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = FILENAME;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Stage 4: Final Output</h3>
          <p className="text-sm text-slate-500">Download generated RPGLE test code after successful generation.</p>
        </div>
        <button
          type="button"
          onClick={download}
          disabled={!code}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Download RPG Code
        </button>
      </div>
    </Card>
  );
};
