
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrailCard from "@/components/TrailCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Compass, MapPin, Users, Heart } from "lucide-react";

const Index = () => {
  // Sample trail data - to be replaced with Supabase data later
  const featuredTrails = [
    {
      id: "1",
      name: "Emerald Forest Loop",
      location: "Boulder, CO",
      imageUrl: "https://images.unsplash.com/photo-1534174533380-5c8a7e77453b?q=80&w=1000&auto=format&fit=crop",
      difficulty: "moderate",
      length: 3.2,
      elevation: 450,
      tags: ["scenic", "forest", "dog-friendly"],
      likes: 241
    },
    {
      id: "2",
      name: "Sunrise Mountain Trail",
      location: "Portland, OR",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop",
      difficulty: "hard",
      length: 5.8,
      elevation: 1200,
      tags: ["waterfall", "views", "challenging"],
      likes: 189
    },
    {
      id: "3",
      name: "Riverside Path",
      location: "Austin, TX",
      imageUrl: "https://images.unsplash.com/photo-1523472721958-978152a13ad5?q=80&w=1000&auto=format&fit=crop",
      difficulty: "easy",
      length: 2.1,
      elevation: 120,
      tags: ["accessible", "river", "beginner"],
      likes: 312
    }
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Trails */}
      <section className="py-16 bg-white dark:bg-greentrail-950">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200">
              Featured Trails
            </h2>
            <Link to="/discover">
              <Button variant="ghost" className="text-greentrail-600 hover:text-greentrail-800 hover:bg-greentrail-100 dark:text-greentrail-400 dark:hover:text-greentrail-200 dark:hover:bg-greentrail-900">
                View All <Compass className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrails.map((trail) => (
              <TrailCard
                key={trail.id}
                {...trail}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* App Features */}
      <section className="py-16 bg-greentrail-50 dark:bg-greentrail-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-greentrail-800 dark:text-greentrail-200 mb-12">
            Explore the Outdoors, Your Way
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-greentrail-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-greentrail-100 dark:bg-greentrail-700 text-greentrail-600 dark:text-greentrail-300 mb-4">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-3">
                Discover Trails
              </h3>
              <p className="text-greentrail-600 dark:text-greentrail-400">
                Find cannabis-friendly trails near you or plan your next adventure with detailed trail information.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-greentrail-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-greentrail-100 dark:bg-greentrail-700 text-greentrail-600 dark:text-greentrail-300 mb-4">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-3">
                Connect with Others
              </h3>
              <p className="text-greentrail-600 dark:text-greentrail-400">
                Join a community of like-minded explorers, share experiences, and organize group hikes.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-greentrail-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-greentrail-100 dark:bg-greentrail-700 text-greentrail-600 dark:text-greentrail-300 mb-4">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-3">
                Share Experiences
              </h3>
              <p className="text-greentrail-600 dark:text-greentrail-400">
                Create photo albums, leave reviews, and document your favorite trail moments.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-greentrail-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-greentrail-100 text-lg mb-8">
              Join GreenTrails today and discover a community of outdoor enthusiasts who share your passion.
            </p>
            <Link to="/auth?signup=true">
              <Button className="bg-white text-greentrail-700 hover:bg-greentrail-100 px-8 py-6 text-lg rounded-full">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
