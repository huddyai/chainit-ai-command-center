import { useMemo, useState } from 'react';
import Header from './components/Header';
import ModuleCard from './components/ModuleCard';
import ModuleModal from './components/ModuleModal';
import LeadQualifier from './components/LeadQualifier';
import ContentPipeline from './components/ContentPipeline';
import CompetitiveIntel from './components/CompetitiveIntel';
import OpsAutomator from './components/OpsAutomator';

type ModuleId = 'lead' | 'content' | 'intel' | 'ops';

const modules: Array<{ id: ModuleId; title: string; description: string; icon: string }> = [
  { id: 'lead', title: 'Lead Qualifier Agent', description: 'Qualify inbound prospects and generate personalized outreach.', icon: '🎯' },
  { id: 'content', title: 'Content Pipeline Agent', description: 'Generate multi-channel marketing content from one brief.', icon: '✍️' },
  { id: 'intel', title: 'Competitive Intel Agent', description: 'Build rapid battle cards and competitor snapshots.', icon: '🛰️' },
  { id: 'ops', title: 'Internal Ops Automator', description: 'Design automation workflows for repetitive internal tasks.', icon: '⚙️' },
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);

  const moduleBody = useMemo(() => {
    switch (activeModule) {
      case 'lead':
        return <LeadQualifier />;
      case 'content':
        return <ContentPipeline />;
      case 'intel':
        return <CompetitiveIntel />;
      case 'ops':
        return <OpsAutomator />;
      default:
        return null;
    }
  }, [activeModule]);

  return (
    <main className="min-h-screen bg-[#0a0e1a] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Header />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              onLaunch={() => setActiveModule(module.id)}
            />
          ))}
        </section>
      </div>

      {activeModule && (
        <ModuleModal
          title={modules.find((module) => module.id === activeModule)?.title ?? ''}
          onClose={() => setActiveModule(null)}
        >
          {moduleBody}
        </ModuleModal>
      )}
    </main>
  );
}
