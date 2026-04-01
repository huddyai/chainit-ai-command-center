import { useState } from 'react';
import CopyButton from './CopyButton';
import LoadingDot from './LoadingDot';
import { callAnthropicJSON } from '../utils/api';

type Step = { stepNumber: number; action: string; tool: string; details: string };
type OpsResult = {
  workflowName: string;
  summary: string;
  steps: Step[];
  recommendedStack: string[];
  implementationNotes: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  estimatedSetupTime: string;
};

const systemPrompt =
  'You are an internal operations automation architect for ChainIT, a Web3 identity verification company. You help teams automate repetitive workflows using tools like Zapier, Make.com, n8n, webhooks, Slack integrations, Google Sheets, CRMs, and custom API calls. You think in systems and always suggest the simplest reliable approach first.';

export default function OpsAutomator() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<OpsResult | null>(null);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const parsed = await callAnthropicJSON<OpsResult>(
        systemPrompt,
        `Design an automation workflow for this task: ${input}. Respond in JSON with: workflowName, summary (1-2 sentences), steps (array of objects with stepNumber, action, tool, and details), recommendedStack (primary tools needed), implementationNotes (any gotchas or setup tips), complexity (Simple, Medium, or Complex), estimatedSetupTime (e.g. '30 minutes', '2 hours').`,
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
      <label className="block text-sm font-medium text-slate-200">Describe a repetitive task or workflow you want to automate</label>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white" />
      <button type="button" onClick={run} className="rounded-lg bg-[#00c896] px-4 py-2.5 text-sm font-semibold text-[#052e24] transition hover:bg-[#00a87a]">Build Workflow</button>
      {loading && <LoadingDot label="Generating..." />}
      {error && <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">Something went wrong. Please try again.<button onClick={run} className="ml-3 rounded bg-red-400/20 px-2 py-1">Retry</button></div>}
      {result && (
        <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a]/60 p-4 animate-[fadeIn_280ms_ease-out]">
          <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{result.workflowName}</h3><span className="rounded-full border border-[#00c896]/30 bg-[#00c896]/10 px-2.5 py-1 text-xs font-semibold text-[#00c896]">{result.complexity}</span></div>
          <p className="text-sm text-slate-300">{result.summary}</p>
          <div><h4 className="font-semibold">Step-by-Step Plan</h4><ol className="list-decimal pl-5 text-sm text-slate-300">{result.steps.map((step) => <li key={step.stepNumber} className="mb-2"><span className="font-medium text-slate-100">{step.action}</span> ({step.tool}) — {step.details}</li>)}</ol></div>
          <div><h4 className="font-semibold">Recommended Stack</h4><p className="text-sm text-slate-300">{result.recommendedStack.join(', ')}</p></div>
          <div><h4 className="font-semibold">Implementation Notes</h4><p className="text-sm text-slate-300">{result.implementationNotes}</p></div>
          <div className="flex items-center justify-between"><p className="text-sm text-slate-300"><span className="font-semibold">Estimated setup:</span> {result.estimatedSetupTime}</p><CopyButton value={JSON.stringify(result, null, 2)} /></div>
        </div>
      )}
    </section>
  );
}
