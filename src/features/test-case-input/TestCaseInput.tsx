import { useAppStore } from '../../store/appStore';
import { EXAMPLE_INPUT } from '../../utils/constants';
import { Card } from '../../components/Card';

export const TestCaseInput = () => {
  const { inputText, setInputText, startGeneration, isLoading } = useAppStore();

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Natural-Language Test Case</h2>
        <button
          type="button"
          onClick={() => setInputText(EXAMPLE_INPUT)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Use example
        </button>
      </div>
      <textarea
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        placeholder="Describe your RPG test scenarios in plain language..."
        className="h-64 w-full rounded-xl border border-slate-300 p-4 text-sm shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => void startGeneration()}
          disabled={isLoading}
          className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Generating...' : 'Generate RPG Tests'}
        </button>
      </div>
    </Card>
  );
};
