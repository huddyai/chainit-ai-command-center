import { useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import LoadingDot from './LoadingDot';
import { callAnthropicJSON } from '../utils/api';

type BlogOutline = { title: string; sections: Array<{ heading: string; keyPoints: string[] }> };
type EmailNewsletter = { subject: string; previewText: string; body: string };
type ContentResult = {
  blogOutline?: BlogOutline;
  twitterThread?: string[];
  linkedinPost?: string;
  emailNewsletter?: EmailNewsletter;
};

const systemPrompt =
  "You are a content marketing agent for ChainIT, a Web3 identity verification and digital authentication company. You write in a confident, technical but accessible tone. You understand blockchain, Web3, identity verification, Validated Data Tokens (VDTs), biometric authentication, age verification compliance, and smart contract agreements. Your content positions ChainIT as the leader in bridging physical and digital identity.";

const options = ['Blog Post Outline', 'X/Twitter Thread', 'LinkedIn Post', 'Email Newsletter', 'All Formats'] as const;
const tabs = ['blogOutline', 'twitterThread', 'linkedinPost', 'emailNewsletter'] as const;

export default function ContentPipeline() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<(typeof options)[number]>('All Formats');
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('blogOutline');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<ContentResult | null>(null);

  const availableTabs = useMemo(() => tabs.filter((tab) => Boolean(result?.[tab])), [result]);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const parsed = await callAnthropicJSON<ContentResult>(
        systemPrompt,
        `Create ${contentType} about: ${topic}. If 'All Formats' is selected, generate all four formats. For each format, respond in JSON with: blogOutline (with title, sections array with heading and key points), twitterThread (array of 4-6 tweets, no emojis, natural tone), linkedinPost (professional post, 150-200 words), emailNewsletter (subject line, preview text, body with 3 sections). Only include the formats requested.`,
      );
      setResult(parsed);
      setActiveTab((tabs.find((tab) => Boolean(parsed?.[tab])) ?? 'blogOutline') as (typeof tabs)[number]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <label className="block text-sm font-medium text-slate-200">Enter a topic or content brief</label>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white outline-none ring-[#00c896]/30 transition focus:ring"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value as (typeof options)[number])}
          className="rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-white"
        >
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <button
          type="button"
          onClick={run}
          className="rounded-lg bg-[#00c896] px-4 py-2.5 text-sm font-semibold text-[#052e24] transition hover:bg-[#00a87a]"
        >
          Generate Content
        </button>
      </div>

      {loading && <LoadingDot label="Generating..." />}
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
          <div className="flex flex-wrap gap-2">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md border px-3 py-1.5 text-xs ${activeTab === tab ? 'border-[#00c896]/60 bg-[#00c896]/15 text-[#00c896]' : 'border-white/10 text-slate-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'blogOutline' && result.blogOutline && (
            <div>
              <div className="mb-2 flex items-center justify-between"><h4 className="font-semibold">{result.blogOutline.title}</h4><CopyButton value={JSON.stringify(result.blogOutline, null, 2)} /></div>
              {result.blogOutline.sections.map((section) => (
                <div key={section.heading} className="mb-3">
                  <p className="font-medium text-slate-100">{section.heading}</p>
                  <ul className="list-disc pl-5 text-sm text-slate-300">{section.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'twitterThread' && result.twitterThread && (
            <div>
              <div className="mb-2 flex items-center justify-between"><h4 className="font-semibold">X / Twitter Thread</h4><CopyButton value={result.twitterThread.join('\n\n')} /></div>
              <ol className="list-decimal pl-5 text-sm text-slate-300">{result.twitterThread.map((tweet) => <li key={tweet} className="mb-2">{tweet}</li>)}</ol>
            </div>
          )}

          {activeTab === 'linkedinPost' && result.linkedinPost && (
            <div>
              <div className="mb-2 flex items-center justify-between"><h4 className="font-semibold">LinkedIn Post</h4><CopyButton value={result.linkedinPost} /></div>
              <p className="whitespace-pre-wrap text-sm text-slate-300">{result.linkedinPost}</p>
            </div>
          )}

          {activeTab === 'emailNewsletter' && result.emailNewsletter && (
            <div>
              <div className="mb-2 flex items-center justify-between"><h4 className="font-semibold">Email Newsletter</h4><CopyButton value={JSON.stringify(result.emailNewsletter, null, 2)} /></div>
              <p className="text-sm text-slate-300"><span className="font-semibold">Subject:</span> {result.emailNewsletter.subject}</p>
              <p className="text-sm text-slate-300"><span className="font-semibold">Preview:</span> {result.emailNewsletter.previewText}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{result.emailNewsletter.body}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
