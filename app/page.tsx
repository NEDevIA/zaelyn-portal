import "@/app/landing.css";
import LandingNav from "@/components/home/LandingNav";
import LandingHero from "@/components/home/LandingHero";
import LandingDemo from "@/components/home/LandingDemo";
import LandingLanguages from "@/components/home/LandingLanguages";
import LandingAmericas from "@/components/home/LandingAmericas";
import LandingPrivacy from "@/components/home/LandingPrivacy";
import LandingModules from "@/components/home/LandingModules";
import LandingChannels from "@/components/home/LandingChannels";
import LandingCompare from "@/components/home/LandingCompare";
import LandingFooter from "@/components/home/LandingFooter";

export const metadata = {
  title: "Zaelyn — Tu Segunda Mente",
  description: "La IA que te recuerda, te conoce y crece contigo — con privacidad real.",
};

export default function LandingPage() {
  return (
    <div className="landing-root">
      <LandingNav />
      <LandingHero />
      <hr className="divider" />
      <LandingDemo />
      <hr className="divider" />
      <LandingLanguages />
      <hr className="divider" />
      <LandingAmericas />
      <hr className="divider" />
      <LandingPrivacy />
      <hr className="divider" />
      <LandingModules />
      <hr className="divider" />
      <LandingChannels />
      <hr className="divider" />
      <LandingCompare />
      <hr className="divider" />
      <LandingFooter />
    </div>
  );
}
