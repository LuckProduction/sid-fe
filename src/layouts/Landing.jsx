import { Footer, Navbar } from '@/components';
import { useService } from '@/hooks';
import { LandingService } from '@/services';
import { Outlet } from 'react-router-dom';

const Landing = () => {
  const getAllVisiMisi = useService(LandingService.getAllVisiMisi);
  const getAllSpeech = useService(LandingService.getSpeech);
  const getAllInstitution = useService(LandingService.getAllInstitution);
  const getAllVillageProfile = useService(LandingService.getVillageProfile);
  const getAllArticle = useService(LandingService.getAllArticle);

  return (
    <div className="flex h-dvh flex-col font-sans">
      <header className="fixed left-0 right-0 top-0 z-[999] border border-slate-300 bg-white">
        <Navbar villageProfile={getAllVillageProfile} />
      </header>

      <main className="flex-auto bg-white pt-8">
        <Outlet
          context={{
            villageProfile: getAllVillageProfile,
            speech: getAllSpeech,
            visiMisi: getAllVisiMisi,
            institution: getAllInstitution,
            article: getAllArticle
          }}
        />
        <Footer />
      </main>
    </div>
  );
};

export default Landing;
