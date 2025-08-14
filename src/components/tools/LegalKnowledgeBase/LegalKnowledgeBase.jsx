// src/components/tools/LegalKnowledgeBase/LegalKnowledgeBase.jsx

import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { PageShell, SectionHeader, Card, Input, Button } from '../../../shared/ui';

/**
 * Functional Placeholder for Legal Knowledge Base.
 * This component is now a stable placeholder, ready for future
 * integration with a real legal database API.
 */
const LegalKnowledgeBase = () => {
  return (
    <PageShell
      header={
        <SectionHeader
          title="Legal Knowledge Base"
          subtitle="Search VA regulations, case law, and manuals."
          icon={BookOpen}
        />
      }
    >
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-8">
          <div className="flex space-x-3">
            <Input
              placeholder="Enter a search query (e.g., 'Tinnitus secondary to PTSD')"
              icon={Search}
              className="text-lg"
            />
            <Button className="px-8">Search</Button>
          </div>
        </Card>

        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-white mb-2">
            Database Integration Pending
          </h3>
          <p className="text-slate-400">
            This tool is ready for connection to a live legal database service.
          </p>
        </div>
      </div>
    </PageShell>
  );
};

export default LegalKnowledgeBase;
