import { useState } from 'react';
import CopyButton from './CopyButton';
import LoadingDot from './LoadingDot';
import { callAnthropicJSON } from '../utils/api';

type IntelResult = {
  competitorName: string;
  overview: string;
  keyProducts: string[];
  positioning: string;
  chainitAdvantages: string[];
  competitorStrengths: string[];
  battleCard: string;
};

const systemPrompt =
  "You are a competitive intelligence agent for ChainIT. ChainIT is a Web3 digital identity and verification platform. Core products: Validated Data Tokens (VDTs) for tamper-proof records, ChainIT-ID for biometric identity verification, Age App for age verification, Pactvera for smart contracts, Sportafi for NIL payments. ChainIT uses blockchain for immutable verification, supports Web2 and Web3 ecosystems, and has 14 U.S. patents. They serve banks, mortgage lenders, government agencies, gaming, sports betting, and e-commerce.";

export default function CompetitiveIntel() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<IntelResult | null>(null);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const parsed = await callAnthropicJSON<IntelResult>(
        systemPrompt,
        `Analyze this competitor: ${input}. Respond in JSON with: competitorName, overview (2-3 sentences), keyProducts (array of strings), positioning (their core messaging/value prop), chainitAdvantages (array of 3-4 specific areas where ChainIT wins), competitorStrengths (array of 1-2 honest areas where they're strong), battleCard (a 3-4 sentence summary a sales rep could reference on a call).`,
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
      <label className="block text-sm font-medium text-slate-200">Enter a competitor name or URL</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white" />
        <button type="button" onClick={run} className="rounded-lg bg-[#00c896] px-4 py-2.5 text-sm font-semibold text-[#052e24] transition hover:bg-[#00a87a]">Run Intel</button>
      </div>
      {loading && <LoadingDot label="Analyzing..." />}
      {error && <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">Something went wrong. Please try again.<button onClick={run} className="ml-3 rounded bg-red-400/20 px-2 py-1">Retry</button></div>}
      {result && (
        <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a]/60 p-4 animate-[fadeIn_280ms_ease-out]">
          <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{result.competitorName}</h3><CopyButton value={JSON.stringify(result, null, 2)} /></div>
          <p className="text-sm text-slate-300">{result.overview}</p>
          <div><h4 className="font-semibold">Key Products/Features</h4><ul className="list-disc pl-5 text-sm text-slate-300">{result.keyProducts.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h4 className="font-semibold">Positioning</h4><p className="text-sm text-slate-300">{result.positioning}</p></div>
          <div><h4 className="font-semibold">Where ChainIT Wins</h4><ul className="list-disc pl-5 text-sm text-slate-300">{result.chainitAdvantages.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h4 className="font-semibold">Competitor Strengths</h4><ul className="list-disc pl-5 text-sm text-slate-300">{result.competitorStrengths.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h4 className="font-semibold">Battle Card</h4><p className="text-sm text-slate-300">{result.battleCard}</p></div>
        </div>
      )}
    </section>
  );
}
