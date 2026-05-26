import HeroSection from "../components/home/HeroSection";
import FeaturedCars from "../components/home/FeaturedCars";
import ServicesSection from "../components/home/ServicesSection";
import AboutSection from "../components/home/AboutSection";
import ContactSection from "../components/home/ContactSection";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedCars />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
