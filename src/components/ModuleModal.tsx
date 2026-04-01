import { type ReactNode } from 'react';

type ModuleModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function ModuleModal({ title, onClose, children }: ModuleModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex animate-[fadeIn_220ms_ease-out] items-end bg-[#0a0e1a]/85 p-0 md:items-center md:p-6">
      <div className="h-[100dvh] w-full animate-[slideUp_260ms_ease-out] overflow-y-auto border border-white/10 bg-[#111827] md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#111827]/95 px-5 py-4 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-[#00c896]/40 hover:text-white"
          >
            Back
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
