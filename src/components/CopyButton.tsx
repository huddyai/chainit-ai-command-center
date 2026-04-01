import { useState } from 'react';

type CopyButtonProps = {
  value: string;
  className?: string;
};

export default function CopyButton({ value, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:border-[#00c896]/50 hover:text-white ${className}`}
    >
      {copied ? <span className="text-[#00c896]">Copied!</span> : 'Copy'}
    </button>
  );
}
