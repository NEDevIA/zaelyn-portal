import Nav from "@/components/home/Nav";
import Hero from "@/components/home/Hero";
import DemoWindow from "@/components/home/DemoWindow";
import PersonaSection from "@/components/home/PersonaSection";
import PrivacySection from "@/components/home/PrivacySection";
import ModulesSection from "@/components/home/ModulesSection";
import ChannelsSection from "@/components/home/ChannelsSection";
import CompareSection from "@/components/home/CompareSection";
import FooterCTA from "@/components/home/FooterCTA";
import Footer from "@/components/home/Footer";

export default function LandingPage() {
  return (
    <main>
      <Nav />
      <Hero />
      <DemoWindow />
      <PersonaSection />
      <PrivacySection />
      <ModulesSection />
      <ChannelsSection />
      <CompareSection />
      <FooterCTA />
      <Footer />
    </main>
  );
}
