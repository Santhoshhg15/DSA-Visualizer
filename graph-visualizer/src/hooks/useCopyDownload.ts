import { useState } from 'react';
import { algorithmCode } from '../data/algorithmCode';

export function useCopyDownload(algorithmKey: string | null) {
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadState, setDownloadState] = useState<'idle' | 'success'>('idle');

  const getCode = () => {
    if (!algorithmKey) return null;
    const entry = algorithmCode[algorithmKey];
    if (!entry) return null;
    return {
      java: entry.javaCode.join('\n'),
      fileName: entry.fileName,
      algorithmName: entry.algorithmName,
      timeComplexity: entry.timeComplexity,
      spaceComplexity: entry.spaceComplexity
    };
  };

  const handleCopy = async () => {
    const code = getCode();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.java);
      setCopyState('success');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  const handleDownload = () => {
    const code = getCode();
    if (!code) return;
    const header = [
      '// ============================================',
      `// ${code.algorithmName}`,
      '// DSA Visualizer — Generated Code',
      '// ============================================',
      `// Time Complexity:  ${code.timeComplexity}`,
      `// Space Complexity: ${code.spaceComplexity}`,
      '// ============================================',
      '// Source: dsa-visualizer-pearl.vercel.app',
      '// ============================================',
      '',
      ''
    ].join('\n');
    const fullCode = header + code.java;
    const blob = new Blob([fullCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = code.fileName;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadState('success');
    setTimeout(() => setDownloadState('idle'), 1500);
  };

  return {
    copyState,
    downloadState,
    handleCopy,
    handleDownload,
    isDisabled: !algorithmKey || !algorithmCode[algorithmKey]
  };
}
