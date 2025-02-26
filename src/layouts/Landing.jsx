import { Footer, Navbar } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { Outlet } from 'react-router-dom';

const Landing = () => {
  const getAllVisiMisi = useService(LandingService.getAllVisiMisi);
  const getAllArticle = useService(LandingService.getAllArticle);
  const getAllSpeech = useService(LandingService.getSpeech);
  const getAllInstitution = useService(LandingService.getAllInstitution);
  const getAllVillageProfile = useService(LandingService.getVillageProfile);

  return (
    <div className="flex h-dvh flex-col font-sans">
      <header className="fixed left-0 right-0 top-0 z-[9999] border border-slate-300 bg-white">
        <Navbar villageProfile={getAllVillageProfile} />
      </header>

      <main className="flex-auto bg-white pt-8">
        <Outlet
          context={{
            villageProfile: getAllVillageProfile,
            article: getAllArticle,
            speech: getAllSpeech,
            visiMisi: getAllVisiMisi,
            institution: getAllInstitution
          }}
        />
        <Footer />
      </main>
    </div>
  );
};

export default Landing;
