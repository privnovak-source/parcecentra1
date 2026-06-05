import Navigation from "@/sections/Navigation";
import HeroSection from "@/sections/HeroSection";
import MenuSection from "@/sections/MenuSection";
import AboutSection from "@/sections/AboutSection";
import ContactSection from "@/sections/ContactSection";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <MenuSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
