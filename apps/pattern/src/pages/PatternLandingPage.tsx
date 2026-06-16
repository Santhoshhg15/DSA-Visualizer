
interface PatternLandingPageProps {
  onOpenVisualizer: () => void;
  onSelectAlgorithm: (algoId: string) => void;
}

export function PatternLandingPage({ onOpenVisualizer, onSelectAlgorithm }: PatternLandingPageProps) {
  const algorithms = [
    {
      id: 'naive',
      name: 'Naive Pattern Search',
      icon: '🔄',
      accent: '#ff6eb4',
      time: 'O(n × m)',
      space: 'O(1)',
      description: 'The brute-force approach. Slides the pattern one position at a time across the text, comparing all characters at each position. Simple to understand, costly for large inputs.',
      tags: ['BEGINNER', 'BRUTE FORCE', 'NO PREPROCESSING']
    },
    {
      id: 'kmp',
      name: 'KMP Algorithm',
      icon: '🧠',
      accent: '#5ea8ff',
      time: 'O(n + m)',
      space: 'O(m)',
      description: 'Knuth-Morris-Pratt uses a precomputed LPS (Longest Proper Prefix Suffix) array to skip characters after a mismatch. Never re-examines a character already matched. Optimal for single pattern search.',
      tags: ['INTERMEDIATE', 'OPTIMAL', 'LPS ARRAY']
    },
    {
      id: 'rabin',
      name: 'Rabin-Karp',
      icon: '#️⃣',
      accent: '#4fffb0',
      time: 'O(n + m) avg',
      space: 'O(1)',
      description: 'Uses polynomial rolling hash to compare pattern and text windows in O(1). Characters only compared on hash match. Excellent for multiple pattern search and plagiarism detection.',
      tags: ['INTERMEDIATE', 'HASHING', 'ROLLING HASH']
    },
    {
      id: 'trie',
      name: 'Trie Word Search II',
      icon: '🌲',
      accent: '#a371f7',
      time: 'O(M × 4^L)',
      space: 'O(chars)',
      description: 'Builds a Trie from all words then DFS-searches a 2D character grid. Trie structure enables early pruning of dead-end paths. Classic LeetCode hard problem (Word Search II).',
      tags: ['ADVANCED', 'TRIE', 'GRID DFS']
    },
    {
      id: 'triePlayground',
      name: 'Trie Playground',
      icon: '🎮',
      accent: '#f59e0b',
      time: 'O(L) per operation',
      space: 'O(total chars)',
      description: 'Interactive Trie sandbox. Insert words, search for exact matches, and check prefix existence — all animated step by step. Perfect for understanding how prefix trees work.',
      tags: ['INTERACTIVE', 'SANDBOX', 'PREFIX TREE']
    }
  ];

  const scrollToAlgorithms = () => {
    document.getElementById('algorithms-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-gradient-1)] text-[var(--text-color)] overflow-y-auto overflow-x-hidden font-sans">
      <div className="canvas-grid fixed inset-0 pointer-events-none opacity-40"></div>
      
      <div className="relative z-10 max-w-[900px] mx-auto pb-16">
        
        {/* SECTION 1 - Hero */}
        <div className="flex flex-col items-center text-center px-10 pt-12 pb-8">
          <div 
            className="mb-4 bg-[#5ea8ff]/10 border border-[#5ea8ff]/30 rounded-full px-3.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#5ea8ff] font-semibold"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '0ms', opacity: 0 }}
          >
            DSA VISUALIZER — PATTERN MODULE
          </div>
          <h1 
            className="text-[36px] font-bold text-[var(--text-color)] tracking-[-0.02em] mb-2 font-sans"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '80ms', opacity: 0 }}
          >
            String Pattern Matching
          </h1>
          <p 
            className="text-[15px] text-[var(--muted-color)] max-w-[500px] mb-7 leading-relaxed font-sans"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '160ms', opacity: 0 }}
          >
            Explore how computers efficiently search for patterns inside text — from brute force to optimal algorithms
          </p>
          
          <div 
            className="flex gap-8 items-center justify-center mb-7"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '240ms', opacity: 0 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-[24px] font-mono font-bold text-[#5ea8ff]">5</span>
              <span className="text-[11px] font-sans uppercase text-[var(--muted-color)]">Algorithms</span>
            </div>
            <div className="w-[1px] h-8 bg-[var(--border-color)]"></div>
            <div className="flex flex-col items-center">
              <span className="text-[24px] font-mono font-bold text-[#5ea8ff]">O(n+m)</span>
              <span className="text-[11px] font-sans uppercase text-[var(--muted-color)]">Best Time</span>
            </div>
            <div className="w-[1px] h-8 bg-[var(--border-color)]"></div>
            <div className="flex flex-col items-center">
              <span className="text-[24px] font-mono font-bold text-[#5ea8ff]">3</span>
              <span className="text-[11px] font-sans uppercase text-[var(--muted-color)]">Concepts</span>
            </div>
          </div>
          
          <button 
            onClick={onOpenVisualizer}
            className="bg-[#5ea8ff] hover:bg-[#3d88eb] text-white text-[13px] font-sans font-semibold py-2.5 px-7 rounded-lg shadow-[0_0_20px_rgba(94,168,255,0.25)] hover:shadow-[0_0_30px_rgba(94,168,255,0.4)] transition-all mt-2"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '320ms', opacity: 0 }}
          >
            Open Pattern Visualizer →
          </button>
        </div>

        {/* SECTION 2 - What is Pattern Matching */}
        <div className="px-10 pb-12">
          <div 
            className="flex items-center gap-3 mb-6"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '0ms', opacity: 0 }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#5ea8ff]/10 border border-[#5ea8ff]/30 flex items-center justify-center text-sm">🔍</div>
            <h2 className="text-[#5ea8ff] text-[22px] font-bold font-sans">Pattern Matching Fundamentals</h2>
            <div className="flex-grow h-[1px] bg-[var(--border-color)] ml-2"></div>
            <div className="text-[10px] uppercase tracking-wider bg-[var(--border-color)] text-[var(--muted-color)] px-2 py-1 rounded">3 concepts</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1 - The Problem */}
            <div 
              className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[14px] p-5 relative overflow-hidden hover:border-[#5ea8ff]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all flex flex-col group"
              style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '80ms', opacity: 0 }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#5ea8ff] rounded-l-[3px]"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[30px] h-[30px] rounded border border-[#5ea8ff]/30 bg-[#5ea8ff]/10 flex items-center justify-center text-base">❓</div>
                <h3 className="text-[15px] font-bold font-sans text-[var(--text-color)]">The Problem</h3>
              </div>
              <div className="bg-[#5ea8ff]/[0.08] border border-[#5ea8ff]/25 rounded-lg py-2.5 px-3.5 text-[12px] font-mono text-[#5ea8ff] mb-4">
                Given a text T of length n and a pattern P of length m, find all positions where P occurs in T.
              </div>
              <p className="text-[13px] font-sans text-[var(--muted-color)] leading-[1.7] mb-5">
                Pattern matching is one of the most fundamental problems in computer science. It powers text editors (Ctrl+F), search engines, DNA sequence analysis, network intrusion detection, and plagiarism checkers. The challenge is to do this as efficiently as possible.
              </p>
              
              <div className="mt-auto">
                <div className="bg-[var(--bg-gradient-1)] border border-[var(--border-color)] rounded-lg h-[140px] flex items-center justify-center mb-4 relative w-full overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 280 140" xmlns="http://www.w3.org/2000/svg">
                    {/* TEXT row */}
                    <text x="140" y="25" fill="var(--muted-color)" fontSize="9" fontFamily="Space Grotesk, sans-serif" textAnchor="middle">TEXT (n=9)</text>
                    <g transform="translate(14, 32)">
                      {['A','B','C','A','B','D','A','B','C'].map((c, i) => (
                        <g key={i} transform={`translate(${i * 28}, 0)`}>
                          <rect width="28" height="28" fill={i < 3 || i >= 6 ? "rgba(0, 200, 150, 0.25)" : "#1C1C21"} stroke={i < 3 || i >= 6 ? "#00C896" : "#2A2A35"} />
                          <text x="14" y="19" fill="#F0F0F5" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="bold" textAnchor="middle">{c}</text>
                        </g>
                      ))}
                    </g>
                    {/* PATTERN row 1 */}
                    <text x="140" y="85" fill="var(--muted-color)" fontSize="9" fontFamily="Space Grotesk, sans-serif" textAnchor="middle">PATTERN (m=3)</text>
                    <g transform="translate(14, 92)">
                      {['A','B','C'].map((c, i) => (
                        <g key={i} transform={`translate(${i * 28}, 0)`}>
                          <rect width="28" height="28" fill="rgba(94,168,255,0.25)" stroke="#5ea8ff" />
                          <text x="14" y="19" fill="white" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="bold" textAnchor="middle">{c}</text>
                        </g>
                      ))}
                    </g>
                    {/* Matches */}
                    <g transform="translate(182, 92)">
                      {['A','B','C'].map((c, i) => (
                        <g key={i} transform={`translate(${i * 28}, 0)`}>
                          <rect width="28" height="28" fill="rgba(94,168,255,0.25)" stroke="#5ea8ff" />
                          <text x="14" y="19" fill="white" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="bold" textAnchor="middle">{c}</text>
                        </g>
                      ))}
                    </g>
                    {/* Arrows */}
                    <path d="M 56 62 L 56 70 L 56 68" stroke="#00C896" strokeWidth="2" fill="none" markerEnd="url(#arrow-green)"/>
                    <path d="M 224 62 L 224 70" stroke="#00C896" strokeWidth="2" fill="none" markerEnd="url(#arrow-green)"/>
                    <text x="56" y="132" fill="#00C896" fontSize="9" fontFamily="Space Grotesk, sans-serif" textAnchor="middle">MATCH at 0</text>
                    <text x="224" y="132" fill="#00C896" fontSize="9" fontFamily="Space Grotesk, sans-serif" textAnchor="middle">MATCH at 6</text>
                    <defs>
                      <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#00C896" />
                      </marker>
                    </defs>
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5ea8ff]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-color)]">KEY FACTS</span>
                </div>
                <ul className="space-y-1.5 text-[12px] text-[var(--muted-color)] font-sans">
                  <li className="flex items-start gap-1.5"><span className="text-[#5ea8ff]">›</span> Text length: n, Pattern length: m</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#5ea8ff]">›</span> Naive approach: O(n × m) comparisons</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#5ea8ff]">›</span> Optimal algorithms: O(n + m)</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#5ea8ff]">›</span> Multiple matches can exist in same text</li>
                </ul>
              </div>
            </div>

            {/* Card 2 - Naive Approach */}
            <div 
              className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[14px] p-5 relative overflow-hidden hover:border-[#ff6eb4]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all flex flex-col group"
              style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '160ms', opacity: 0 }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff6eb4] rounded-l-[3px]"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[30px] h-[30px] rounded border border-[#ff6eb4]/30 bg-[#ff6eb4]/10 flex items-center justify-center text-base">🔄</div>
                <h3 className="text-[15px] font-bold font-sans text-[var(--text-color)]">Naive Approach</h3>
              </div>
              <div className="bg-[#ff6eb4]/[0.08] border border-[#ff6eb4]/25 rounded-lg py-2.5 px-3.5 text-[12px] font-mono text-[#ff6eb4] mb-4">
                Try matching the pattern at every possible position in the text. Compare character by character.
              </div>
              <p className="text-[13px] font-sans text-[var(--muted-color)] leading-[1.7] mb-5">
                The brute force approach slides the pattern one position at a time across the text. At each position it compares all m characters. Simple to implement but wasteful — it redoes comparisons already made. Worst case O(n×m) makes it impractical for large inputs.
              </p>
              
              <div className="mt-auto">
                <div className="bg-[var(--bg-gradient-1)] border border-[var(--border-color)] rounded-lg h-[140px] flex items-center justify-center mb-4 relative w-full overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 280 140" xmlns="http://www.w3.org/2000/svg">
                    {/* TEXT row */}
                    <g transform="translate(42, 20)">
                      {['A','B','C','D','A','B','C'].map((c, i) => (
                        <g key={i} transform={`translate(${i * 28}, 0)`}>
                          <rect width="28" height="28" fill="#1C1C21" stroke="#2A2A35" />
                          <text x="14" y="19" fill="#F0F0F5" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="bold" textAnchor="middle">{c}</text>
                        </g>
                      ))}
                    </g>
                    {/* Attempt 1 */}
                    <g transform="translate(42, 54)">
                      <rect width="28" height="20" fill="rgba(0,200,150,0.15)" stroke="#00C896" />
                      <text x="14" y="14" fill="white" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">A</text>
                      
                      <rect x="28" width="28" height="20" fill="rgba(0,200,150,0.15)" stroke="#00C896" />
                      <text x="42" y="14" fill="white" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">B</text>
                      
                      <rect x="56" width="28" height="20" fill="rgba(255,68,68,0.15)" stroke="#FF4444" />
                      <text x="70" y="14" fill="white" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">D</text>
                      <text x="70" y="28" fill="#FF4444" fontSize="10" textAnchor="middle">✗</text>
                    </g>
                    <path d="M 126 64 L 138 64" stroke="#ff6eb4" strokeWidth="1.5" markerEnd="url(#arrow-pink)" />
                    {/* Attempt 2 */}
                    <g transform="translate(70, 80)">
                      <rect width="28" height="20" fill="rgba(255,68,68,0.15)" stroke="#FF4444" />
                      <text x="14" y="14" fill="white" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">A</text>
                      <text x="14" y="28" fill="#FF4444" fontSize="10" textAnchor="middle">✗</text>
                      
                      <rect x="28" width="28" height="20" fill="#1C1C21" stroke="#2A2A35" />
                      <text x="42" y="14" fill="#6B6B80" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">B</text>
                      
                      <rect x="56" width="28" height="20" fill="#1C1C21" stroke="#2A2A35" />
                      <text x="70" y="14" fill="#6B6B80" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">D</text>
                    </g>
                    <path d="M 154 90 L 166 90" stroke="#ff6eb4" strokeWidth="1.5" markerEnd="url(#arrow-pink)" />
                    {/* Attempt 3 */}
                    <g transform="translate(98, 106)">
                      <rect width="28" height="20" fill="rgba(255,68,68,0.15)" stroke="#FF4444" />
                      <text x="14" y="14" fill="white" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">A</text>
                      <text x="14" y="28" fill="#FF4444" fontSize="10" textAnchor="middle">✗</text>
                      
                      <rect x="28" width="28" height="20" fill="#1C1C21" stroke="#2A2A35" />
                      <text x="42" y="14" fill="#6B6B80" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">B</text>
                      
                      <rect x="56" width="28" height="20" fill="#1C1C21" stroke="#2A2A35" />
                      <text x="70" y="14" fill="#6B6B80" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">D</text>
                    </g>
                    <text x="140" y="10" fill="var(--muted-color)" fontSize="9" fontFamily="Space Grotesk, sans-serif" textAnchor="middle">Sliding window — shift by 1 each time</text>
                    <defs>
                      <marker id="arrow-pink" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6eb4" />
                      </marker>
                    </defs>
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff6eb4]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-color)]">KEY FACTS</span>
                </div>
                <ul className="space-y-1.5 text-[12px] text-[var(--muted-color)] font-sans">
                  <li className="flex items-start gap-1.5"><span className="text-[#ff6eb4]">›</span> Time: O(n × m) worst case</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ff6eb4]">›</span> Space: O(1) — no preprocessing</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ff6eb4]">›</span> Simple but inefficient</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#ff6eb4]">›</span> Worst case: pattern "AAA" in "AAAA..."</li>
                </ul>
              </div>
            </div>

            {/* Card 3 - Why Better Algorithms? */}
            <div 
              className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[14px] p-5 relative overflow-hidden hover:border-[#4fffb0]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all flex flex-col group"
              style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '240ms', opacity: 0 }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#4fffb0] rounded-l-[3px]"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[30px] h-[30px] rounded border border-[#4fffb0]/30 bg-[#4fffb0]/10 flex items-center justify-center text-base">⚡</div>
                <h3 className="text-[15px] font-bold font-sans text-[var(--text-color)]">Why Better Algorithms?</h3>
              </div>
              <div className="bg-[#4fffb0]/[0.08] border border-[#4fffb0]/25 rounded-lg py-2.5 px-3.5 text-[12px] font-mono text-[#4fffb0] mb-4">
                Smarter algorithms preprocess the pattern to skip redundant comparisons and achieve linear time O(n+m).
              </div>
              <p className="text-[13px] font-sans text-[var(--muted-color)] leading-[1.7] mb-5">
                KMP uses a failure function to skip positions we already know won't match. Rabin-Karp uses hashing to compare windows in O(1). Trie-based search handles multiple patterns simultaneously. All avoid re-examining characters that the naive approach wastes time on.
              </p>
              
              <div className="mt-auto">
                <div className="bg-[var(--bg-gradient-1)] border border-[var(--border-color)] rounded-lg h-[140px] flex items-center justify-center mb-4 relative w-full overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 280 140" xmlns="http://www.w3.org/2000/svg">
                    <text x="140" y="15" fill="var(--muted-color)" fontSize="9" fontFamily="Space Grotesk, sans-serif" textAnchor="middle">Comparisons for n=9, m=3</text>
                    
                    <g transform="translate(20, 35)">
                      <text x="0" y="10" fill="var(--text-color)" fontSize="9" fontFamily="Space Grotesk, sans-serif">Naive O(n×m)</text>
                      <rect x="0" y="16" width="240" height="12" fill="rgba(255,68,68,0.3)" stroke="#FF4444" rx="2" />
                      <text x="240" y="10" fill="#FF4444" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="end">~81 ops</text>
                    </g>
                    
                    <g transform="translate(20, 65)">
                      <text x="0" y="10" fill="var(--text-color)" fontSize="9" fontFamily="Space Grotesk, sans-serif">KMP O(n+m)</text>
                      <rect x="0" y="16" width="80" height="12" fill="rgba(94,168,255,0.3)" stroke="#5ea8ff" rx="2" />
                      <text x="80" y="10" fill="#5ea8ff" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="end">~12 ops</text>
                    </g>
                    
                    <g transform="translate(20, 95)">
                      <text x="0" y="10" fill="var(--text-color)" fontSize="9" fontFamily="Space Grotesk, sans-serif">Rabin-Karp O(n+m)</text>
                      <rect x="0" y="16" width="80" height="12" fill="rgba(79,255,176,0.3)" stroke="#4fffb0" rx="2" />
                      <text x="80" y="10" fill="#4fffb0" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="end">~12 ops</text>
                    </g>
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4fffb0]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-color)]">KEY FACTS</span>
                </div>
                <ul className="space-y-1.5 text-[12px] text-[var(--muted-color)] font-sans">
                  <li className="flex items-start gap-1.5"><span className="text-[#4fffb0]">›</span> Preprocessing pattern saves search time</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#4fffb0]">›</span> KMP: precompute LPS array O(m)</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#4fffb0]">›</span> Rabin-Karp: rolling hash O(1) per shift</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#4fffb0]">›</span> Trie: handle multiple patterns at once</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3 - Algorithms */}
        <div id="algorithms-section" className="px-10 pb-12">
          <div 
            className="flex items-center gap-3 mb-6"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '0ms', opacity: 0 }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#5ea8ff]/10 border border-[#5ea8ff]/30 flex items-center justify-center text-sm">⚙️</div>
            <h2 className="text-[#5ea8ff] text-[22px] font-bold font-sans">Algorithms</h2>
            <div className="flex-grow h-[1px] bg-[var(--border-color)] ml-2"></div>
            <div className="text-[10px] uppercase tracking-wider bg-[var(--border-color)] text-[var(--muted-color)] px-2 py-1 rounded">5 algorithms</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {algorithms.map((algo, idx) => (
              <div 
                key={algo.id}
                className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[14px] relative overflow-hidden transition-all flex flex-col group"
                style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: `${(idx + 1) * 80}ms`, opacity: 0 }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = algo.accent}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <div className="h-[3px] w-full" style={{ backgroundColor: algo.accent }}></div>
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[24px]">{algo.icon}</span>
                      <h3 className="text-[14px] font-semibold font-sans text-[var(--text-color)] leading-tight max-w-[120px]">{algo.name}</h3>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <div className="text-[10px] font-mono text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                        ⏱️ {algo.time}
                      </div>
                      <div className="text-[10px] font-mono text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                        💾 {algo.space}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[12px] font-sans text-[var(--muted-color)] leading-[1.6] mb-4 min-h-[60px] flex-grow">
                    {algo.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {algo.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-[var(--border-color)] text-[var(--muted-color)] px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => onSelectAlgorithm(algo.id)}
                    className="w-full py-2 rounded-[10px] border border-[var(--border-color)] bg-[var(--input-bg)] text-[11px] font-semibold font-sans uppercase tracking-wider text-[var(--text-color)] transition-all"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = algo.accent;
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = algo.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--input-bg)';
                      e.currentTarget.style.color = 'var(--text-color)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    Visualise →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 - Comparison Table */}
        <div className="px-10 pb-12">
          <h2 
            className="text-[#5ea8ff] text-[22px] font-bold font-sans mb-4"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '0ms', opacity: 0 }}
          >
            Algorithm Comparison
          </h2>
          <div 
            className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-[14px] overflow-hidden w-full"
            style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '0ms', opacity: 0 }}
          >
            <div className="grid grid-cols-[minmax(120px,1fr)_100px_100px_140px_minmax(120px,1.5fr)] bg-[var(--input-bg)] border-b border-[var(--border-color)] p-3 text-[10px] font-semibold font-sans uppercase tracking-[0.08em] text-[var(--muted-color)]">
              <div className="pl-2">ALGORITHM</div>
              <div>TIME</div>
              <div>SPACE</div>
              <div>PREPROCESSING</div>
              <div>BEST FOR</div>
            </div>
            
            {[
              { name: 'Naive', time: 'O(n×m)', space: 'O(1)', prep: 'None', best: 'Simple small inputs' },
              { name: 'KMP', time: 'O(n+m)', space: 'O(m)', prep: 'LPS Array', best: 'Single pattern' },
              { name: 'Rabin-Karp', time: 'O(n+m)', space: 'O(1)', prep: 'Hash compute', best: 'Multiple patterns' },
              { name: 'Trie Search', time: 'O(M×4^L)', space: 'O(chars)', prep: 'Trie build', best: 'Word grid search' },
              { name: 'Trie Sandbox', time: 'O(L)', space: 'O(chars)', prep: 'None', best: 'Learning prefix trees' },
            ].map((row, idx) => (
              <div 
                key={row.name} 
                className={`grid grid-cols-[minmax(120px,1fr)_100px_100px_140px_minmax(120px,1.5fr)] border-b border-[var(--border-color)] last:border-0 p-3 items-center ${idx % 2 === 0 ? 'bg-[var(--input-bg)]/50' : 'bg-[var(--panel-bg)]'}`}
              >
                <div className="pl-2 text-[13px] font-semibold text-[var(--text-color)]">{row.name}</div>
                <div className="text-[12px] font-mono text-[#FFB800]">{row.time}</div>
                <div className="text-[12px] font-mono text-[#A855F7]">{row.space}</div>
                <div className="text-[12px] text-[var(--muted-color)]">{row.prep}</div>
                <div className="text-[12px] text-[var(--muted-color)]">{row.best}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 - CTA */}
        <div 
          className="mx-10 p-10 flex flex-col items-center text-center gap-4 bg-[var(--panel-bg)] border-t border-[var(--border-color)]"
          style={{ animation: 'fadeInUp 400ms ease forwards', animationDelay: '0ms', opacity: 0 }}
        >
          <div className="text-[48px]">🔍</div>
          <h2 className="text-[20px] font-bold font-sans text-[var(--text-color)] m-0">Ready to explore pattern matching?</h2>
          <p className="text-[13px] font-sans text-[var(--muted-color)] max-w-[400px] m-0">
            Choose an algorithm and watch it search through text step by step
          </p>
          <button 
            onClick={onOpenVisualizer}
            className="bg-[#5ea8ff] hover:bg-[#3d88eb] text-white text-[14px] font-sans font-semibold py-3 px-8 rounded-[10px] shadow-[0_0_20px_rgba(94,168,255,0.3)] transition-all mt-2"
          >
            Open Pattern Visualizer →
          </button>
          <button 
            onClick={scrollToAlgorithms}
            className="text-[12px] font-sans text-[var(--muted-color)] hover:text-[#5ea8ff] transition-colors mt-2"
          >
            or pick a specific algorithm ↑
          </button>
        </div>

      </div>
    </div>
  );
}
