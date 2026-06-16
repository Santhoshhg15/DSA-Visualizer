

export interface SortingAlgorithmCardData {
  id: string; // 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'
  name: string;
  icon: string;
  color: string;
  avgComplexity: string;
  worstComplexity: string;
  spaceComplexity: string;
  description: string;
  tags: string[];
}

const sortingAlgorithmsData: SortingAlgorithmCardData[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    icon: '🫧',
    color: '#3b82f6',
    avgComplexity: 'O(n²)',
    worstComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Pushes the largest unsorted element to its correct position on each pass.',
    tags: ['EASY', 'STABLE', 'IN-PLACE']
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    icon: '🔍',
    color: '#ec4899',
    avgComplexity: 'O(n²)',
    worstComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Divides the input list into a sorted and an unsorted sublist. Greedily selects the minimum element from the unsorted sublist and swaps it with the leftmost unsorted element.',
    tags: ['EASY', 'UNSTABLE', 'IN-PLACE']
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    icon: '🃏',
    color: '#0891b2',
    avgComplexity: 'O(n²)',
    worstComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time. It consumes one input element per repetition, finding its correct position within the already sorted portion of the array.',
    tags: ['EASY', 'STABLE', 'IN-PLACE', 'ADAPTIVE']
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    icon: '🔀',
    color: '#10b981',
    avgComplexity: 'O(n log n)',
    worstComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'A divide-and-conquer algorithm. It divides the unsorted list into n sublists, recursively sorts them, and then repeatedly merges sublists to produce new sorted sublists.',
    tags: ['MEDIUM', 'STABLE', 'OUT-OF-PLACE', 'DIVIDE & CONQUER']
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    icon: '⚡',
    color: '#7c3aed',
    avgComplexity: 'O(n log n)',
    worstComplexity: 'O(n²)',
    spaceComplexity: 'O(log n)',
    description: 'Partitions an array around a chosen pivot element. Elements smaller than the pivot are moved before it, and elements larger are moved after it, then recursively sorts the sub-arrays.',
    tags: ['MEDIUM', 'UNSTABLE', 'IN-PLACE', 'FASTEST ON AVG']
  }
];

interface SortingLandingPageProps {
  onSelectAlgorithm: (algoId: string) => void;
  onOpenVisualizer: () => void;
}

export function SortingLandingPage({
  onSelectAlgorithm,
  onOpenVisualizer
}: SortingLandingPageProps) {
  return (
    <div className="w-full min-h-screen bg-[var(--bg-gradient-1)] canvas-grid pb-24 text-[var(--text-color)] selection:bg-blue-500/30">
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-10 py-12 pt-16 animate-fadeInUp" style={{ animationDuration: '400ms' }}>
        {/* Small badge */}
        <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-full px-3.5 py-1 text-[10px] font-semibold uppercase font-sans tracking-[0.08em] text-[#60a5fa] mb-4">
          DSA VISUALIZER — SORTING MODULE
        </div>
        
        {/* Main Title */}
        <h1 className="text-[36px] font-bold tracking-tight text-[var(--text-color)] mb-2 font-sans">
          Sorting Algorithms
        </h1>
        
        {/* Subtitle */}
        <p className="text-[15px] text-[var(--muted-color)] mb-6 font-sans max-w-lg">
          Visualise, trace and understand comparison-based sorting algorithms step by step
        </p>

        {/* Top Open Visualizer Button */}
        <button
          onClick={onOpenVisualizer}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-semibold font-sans px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-200 cursor-pointer active:scale-95 mb-12 animate-pulse"
        >
          Open Sorting Visualizer →
        </button>
      </section>

      {/* 2. ALGORITHMS SECTION */}
      <section className="max-w-6xl mx-auto px-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 bg-blue-500 rounded-full" />
          <h2 className="text-[18px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-color)]">
            Algorithms
          </h2>
          <span className="text-xs text-[var(--muted-color)] font-mono">({sortingAlgorithmsData.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortingAlgorithmsData.map((algo) => (
            <div 
              key={algo.id}
              className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--text-color)]/25 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 relative overflow-hidden group"
            >
              {/* Highlight colored strip on hover */}
              <div 
                className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-300"
                style={{ backgroundColor: algo.color }}
              />

              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none">{algo.icon}</span>
                    <h3 className="text-[16px] font-bold text-[var(--text-color)] group-hover:text-blue-400 transition-colors">
                      {algo.name}
                    </h3>
                  </div>
                </div>

                {/* Complexities Table */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-black/10 rounded-lg border border-[var(--border-color)] text-[10px] font-mono mb-4">
                  <div>
                    <div className="text-[9px] text-[var(--muted-color)] uppercase mb-0.5">Avg Time</div>
                    <div className="font-bold text-amber-400">{algo.avgComplexity}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[var(--muted-color)] uppercase mb-0.5">Worst Time</div>
                    <div className="font-bold text-red-400">{algo.worstComplexity}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[var(--muted-color)] uppercase mb-0.5">Space</div>
                    <div className="font-bold text-purple-400">{algo.spaceComplexity}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11.5px] text-[var(--muted-color)] leading-relaxed mb-5 font-sans min-h-[50px]">
                  {algo.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-5">
                  {algo.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[8px] font-bold px-2 py-0.5 rounded tracking-[0.06em] bg-blue-500/10 text-blue-400 border border-blue-500/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectAlgorithm(algo.id)}
                  className="w-full py-2 bg-[var(--input-bg)] hover:bg-blue-500 hover:text-white border border-[var(--border-color)] hover:border-blue-500 text-[11px] font-bold uppercase tracking-[0.08em] rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  Visualise Algorithm →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
