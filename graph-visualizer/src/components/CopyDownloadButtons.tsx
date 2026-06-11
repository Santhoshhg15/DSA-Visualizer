import { useCopyDownload } from '../hooks/useCopyDownload';

interface CopyDownloadButtonsProps {
  algorithmKey: string | null;
}

export function CopyDownloadButtons({ algorithmKey }: CopyDownloadButtonsProps) {
  const {
    copyState,
    downloadState,
    handleCopy,
    handleDownload,
    isDisabled
  } = useCopyDownload(algorithmKey);

  const getCopyTooltip = () => {
    if (isDisabled) return 'Select an algorithm first';
    if (copyState === 'success') return 'Copied!';
    if (copyState === 'error') return 'Failed to copy';
    return 'Copy Java code';
  };

  const getDownloadTooltip = () => {
    if (isDisabled) return 'Select an algorithm first';
    if (downloadState === 'success') return 'Downloaded!';
    return 'Download Java file';
  };

  const baseButtonClass = "w-7 h-7 flex items-center justify-center rounded-[6px] border border-transparent transition-all duration-200";
  
  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        disabled={isDisabled}
        title={getCopyTooltip()}
        className={`${baseButtonClass} ${
          isDisabled
            ? 'opacity-40 cursor-not-allowed text-gray-500 bg-transparent'
            : copyState === 'success'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : copyState === 'error'
                ? 'text-red-400 bg-red-500/10 border-red-500/30'
                : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20'
        }`}
      >
        {copyState === 'success' ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : copyState === 'error' ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        )}
      </button>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDisabled}
        title={getDownloadTooltip()}
        className={`${baseButtonClass} ${
          isDisabled
            ? 'opacity-40 cursor-not-allowed text-gray-500 bg-transparent'
            : downloadState === 'success'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20'
        }`}
      >
        {downloadState === 'success' ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
      </button>
    </div>
  );
}
