type ModuleCardProps = {
  title: string;
  description: string;
  icon: string;
  onLaunch: () => void;
};

export default function ModuleCard({ title, description, icon, onLaunch }: ModuleCardProps) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#1a1f2e] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#00c896]/60 hover:shadow-[0_0_0_1px_rgba(0,200,150,0.2),0_16px_30px_rgba(0,0,0,0.35)]">
      <div>
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl">
          {icon}
        </div>
        <h2 className="mb-1 text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={onLaunch}
        className="mt-6 w-fit rounded-lg bg-[#00c896] px-4 py-2 text-sm font-semibold text-[#052e24] transition hover:bg-[#00a87a]"
      >
        Launch
      </button>
    </article>
  );
}
