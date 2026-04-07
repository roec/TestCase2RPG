import { DownloadSection } from '../features/download/DownloadSection';
import { ParsedPanel } from '../features/parser/ParsedPanel';
import { ProgressTracker } from '../features/progress-tracker/ProgressTracker';
import { RpgPanel } from '../features/rpg-generator/RpgPanel';
import { TestCaseInput } from '../features/test-case-input/TestCaseInput';
import { StructuredPanel } from '../features/test-case-structurer/StructuredPanel';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/Card';

export const App = () => {
  const { errorMessage, resetAll, isLoading } = useAppStore();

  return (
    <main className="mx-auto max-w-7xl p-6 lg:p-10">
      <header className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-sm">
        <h1 className="text-3xl font-bold">Natural Language Test Case → RPGLE Generator</h1>
        <p className="mt-2 text-slate-200">
          Multi-stage DeepSeek workflow: Parse Description → Structured Test Case → RPG Code → Download.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <TestCaseInput />

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Generation Progress</h2>
              <button
                type="button"
                onClick={resetAll}
                disabled={isLoading}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reset
              </button>
            </div>
            <ProgressTracker />
          </Card>

          {errorMessage ? (
            <Card className="border border-rose-300 bg-rose-50">
              <p className="font-semibold text-rose-700">Generation error</p>
              <p className="mt-1 text-sm text-rose-600">{errorMessage}</p>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6 lg:max-h-[50vh] lg:overflow-y-auto lg:pr-2">
          <ParsedPanel />
          <StructuredPanel />
          <RpgPanel />
          <DownloadSection />
        </div>
      </div>
    </main>
  );
};
