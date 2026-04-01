import { useState } from 'react';
import CopyButton from './CopyButton';
import LoadingDot from './LoadingDot';
import { callAnthropicJSON } from '../utils/api';

type LeadResult = {
  companyName: string;
  companySummary: string;
  fitScore: 'Hot' | 'Warm' | 'Cold';
  fitReasoning: string;
  suggestedProducts: string[];
  outreachEmail: string;
};

const systemPrompt =
  "You are a sales intelligence agent for ChainIT, a Web3 identity verification company. ChainIT's core products include: Validated Data Tokens (VDTs) for tamper-proof digital records, ChainIT-ID for biometric identity verification, Age App for age verification compliance, Pactvera for smart contract agreements, and Sportafi for NIL payment automation. Your job is to qualify leads and determine if they would benefit from ChainIT's products.";

const scoreClass: Record<LeadResult['fitScore'], string> = {
  Hot: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  Warm: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  Cold: 'bg-sky-500/20 text-sky-200 border-sky-300/30',
};

export default function LeadQualifier() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<LeadResult | null>(null);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const parsed = await callAnthropicJSON<LeadResult>(
        systemPrompt,
        `Analyze this lead and determine their fit for ChainIT's products: ${input}. Respond in JSON with these fields: companyName, companySummary (2-3 sentences), fitScore (Hot, Warm, or Cold), fitReasoning (why they are or aren't a fit), suggestedProducts (array of ChainIT products that would help them), outreachEmail (a personalized 3-4 paragraph sales email from ChainIT to this lead).`,
      );
      setResult(parsed);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <label className="block text-sm font-medium text-slate-200">Paste a company URL or describe the lead</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white outline-none ring-[#00c896]/30 transition focus:ring"
        />
        <button
          type="button"
          onClick={run}
          className="rounded-lg bg-[#00c896] px-4 py-2.5 text-sm font-semibold text-[#052e24] transition hover:bg-[#00a87a]"
        >
          Qualify Lead
        </button>
      </div>

      {loading && <LoadingDot label="Analyzing..." />}
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
          Something went wrong. Please try again.
          <button onClick={run} className="ml-3 rounded bg-red-400/20 px-2 py-1">
            Retry
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a]/60 p-4 animate-[fadeIn_280ms_ease-out]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{result.companyName}</h3>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${scoreClass[result.fitScore]}`}>
              {result.fitScore}
            </span>
          </div>
          <p className="text-sm text-slate-300">{result.companySummary}</p>
          <p className="text-sm text-slate-300">{result.fitReasoning}</p>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-100">Suggested ChainIT Products</h4>
            <ul className="list-disc pl-5 text-sm text-slate-300">
              {result.suggestedProducts?.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-100">Outreach Email</h4>
              <CopyButton value={result.outreachEmail} />
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-300">{result.outreachEmail}</p>
          </div>
        </div>
      )}
    </section>
  );
}
