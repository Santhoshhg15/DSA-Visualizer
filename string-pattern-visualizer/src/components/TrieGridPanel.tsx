import type { Step } from '../types';
import { CharCell } from './CharCell';

interface Props { step: Step; }

export function TrieGridPanel({ step }: Props) {
  const { grid = [], dfsPath = [], found = [], trieWord } = step;
  if (!grid.length) return null;

  const pathSet = new Set(dfsPath.map(([r, c]) => `${r},${c}`));
  const lastCell = dfsPath.length ? dfsPath[dfsPath.length - 1] : null;

  return (
    <div className="space-y-4 mb-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
        <div className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider mb-3 flex items-center gap-3">
          <span>Grid</span>
          {trieWord && (
            <span className="font-mono text-[#a371f7] normal-case tracking-normal font-normal">
              path: "{trieWord}"
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          {grid.map((row, r) => (
            <div key={r} className="flex gap-1.5">
              {row.split('').map((ch, c) => {
                const key = `${r},${c}`;
                const isLast = lastCell && lastCell[0] === r && lastCell[1] === c;
                const state = isLast ? 'active' : pathSet.has(key) ? 'path' : 'default';
                return (
                  <CharCell key={c} char={ch} index={r * 10 + c} showIndex={false} state={state} />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {found.length > 0 && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <div className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider mb-3">Words Found</div>
          <div className="flex flex-wrap gap-2">
            {found.map(w => (
              <span key={w} className="px-3 py-1 bg-[#1c4a1c] border border-[#3fb950] text-[#aff5b4] text-sm font-mono rounded-lg">
                {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
