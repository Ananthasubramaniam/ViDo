import React, { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { LandingHero } from './LandingHero';
import { LandingPreview } from './LandingPreview';
import { LandingUseCases } from './LandingUseCases';
import { LandingBenefits } from './LandingBenefits';
import { LandingFooter } from './LandingFooter';
import { NoticeModal } from '../../components/ui';

export const LandingPage: React.FC = () => {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col justify-between selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
      <div>
        <LandingHeader onGoogleSignInClick={() => setIsNoticeOpen(true)} />
        <main>
          <LandingHero onGoogleSignInClick={() => setIsNoticeOpen(true)} />
          <LandingPreview />
          <LandingUseCases />
          <LandingBenefits />
        </main>
      </div>

      <LandingFooter />

      <NoticeModal
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        title="Welcome to ViDo"
        description="You can enter and explore your workspace directly right now without needing to sign in."
      />
    </div>
  );
};
