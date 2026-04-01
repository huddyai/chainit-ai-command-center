export default function LoadingDot({ label = 'Analyzing...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111827]/60 px-4 py-3 text-sm text-slate-200">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#00c896]" />
      {label}
    </div>
  );
}
