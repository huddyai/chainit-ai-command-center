export default function Header() {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111827]/70 p-5 backdrop-blur-sm">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Chain<span className="text-[#00c896]">IT</span>
        </h1>
        <p className="text-sm text-slate-400">AI Command Center</p>
      </div>
      <span className="rounded-full border border-[#00c896]/35 bg-[#00c896]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#00c896]">
        Internal Tools
      </span>
    </header>
  );
}
