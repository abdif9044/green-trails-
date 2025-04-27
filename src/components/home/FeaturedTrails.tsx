
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import TrailCardPrefetch from "@/components/TrailCardPrefetch";
import { Trail } from "@/types/trails";

// Sample trail data - to be replaced with Supabase data later
const featuredTrails: Trail[] = [
  {
    id: "1",
    name: "Emerald Forest Loop",
    location: "Boulder, CO",
    imageUrl: "https://images.unsplash.com/photo-1534174533380-5c8a7e77453b?q=80&w=1000&auto=format&fit=crop",
    difficulty: "moderate",
    length: 3.2,
    elevation: 450,
    tags: ["scenic", "forest", "dog-friendly"],
    likes: 241,
    isAgeRestricted: false
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
    likes: 189,
    isAgeRestricted: false
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
    likes: 312,
    isAgeRestricted: false
  }
];

const FeaturedTrails = () => {
  return (
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
            <TrailCardPrefetch
              key={trail.id}
              {...trail}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrails;
