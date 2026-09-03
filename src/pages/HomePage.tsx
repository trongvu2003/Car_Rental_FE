import HeroSection from "../components/home/HeroSection";
import FeaturedCars from "../components/home/FeaturedCars";
import ServicesSection from "../components/home/ServicesSection";
import AboutSection from "../components/home/AboutSection";
import ContactSection from "../components/home/ContactSection";
import FeaturedBlogs from "../components/home/FeaturedBlogs";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedCars />
      <FeaturedBlogs />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
