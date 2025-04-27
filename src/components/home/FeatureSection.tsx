
import { Compass, MapPin, Users, Heart } from "lucide-react";

const FeatureSection = () => {
  return (
    <section className="py-16 bg-greentrail-50 dark:bg-greentrail-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-greentrail-800 dark:text-greentrail-200 mb-12">
          Explore the Outdoors, Your Way
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MapPin size={28} />}
            title="Discover Trails"
            description="Find cannabis-friendly trails near you or plan your next adventure with detailed trail information."
          />
          
          <FeatureCard
            icon={<Users size={28} />}
            title="Connect with Others"
            description="Join a community of like-minded explorers, share experiences, and organize group hikes."
          />
          
          <FeatureCard
            icon={<Heart size={28} />}
            title="Share Experiences"
            description="Create photo albums, leave reviews, and document your favorite trail moments."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="text-center p-6 bg-white dark:bg-greentrail-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-greentrail-100 dark:bg-greentrail-700 text-greentrail-600 dark:text-greentrail-300 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-3">
      {title}
    </h3>
    <p className="text-greentrail-600 dark:text-greentrail-400">
      {description}
    </p>
  </div>
);

export default FeatureSection;
