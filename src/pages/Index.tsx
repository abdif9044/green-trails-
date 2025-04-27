
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedTrails from "@/components/home/FeaturedTrails";
import FeatureSection from "@/components/home/FeatureSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <FeaturedTrails />
      <FeatureSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
