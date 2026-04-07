import { STAGES } from '../../utils/constants';
import { useAppStore } from '../../store/appStore';
import type { StageStatus } from '../../types/stage';

const colorMap: Record<StageStatus, string> = {
  idle: 'bg-slate-300',
  running: 'bg-blue-500 animate-pulse',
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
};

export const ProgressTracker = () => {
  const { stageStatus } = useAppStore();

  return (
    <div className="space-y-3">
      {STAGES.map((stage, index) => (
        <div key={stage.key} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span className={`h-3.5 w-3.5 rounded-full ${colorMap[stageStatus[stage.key]]}`} />
            {index < STAGES.length - 1 ? <span className="mt-1 h-7 w-px bg-slate-300" /> : null}
          </div>
          <div>
            <p className="font-medium text-slate-900">{stage.label}</p>
            <p className="text-sm text-slate-500">{stage.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
