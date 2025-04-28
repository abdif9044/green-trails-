
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import TrailCardPrefetch from "@/components/TrailCardPrefetch";
import { mockTrails } from "@/data/mock-trails";

// Only show trails from Minnesota, with Quarry Hills first
const minnesotraTrails = mockTrails
  .filter(trail => trail.location.includes("MN"))
  .sort((a, b) => {
    // Always put Quarry Hills first
    if (a.name.includes("Quarry")) return -1;
    if (b.name.includes("Quarry")) return 1;
    return 0;
  })
  .slice(0, 3); // Only show the first 3 trails

const FeaturedTrails = () => {
  return (
    <section className="py-16 bg-white dark:bg-greentrail-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200">
            Featured Minnesota Trails
          </h2>
          <Link to="/discover">
            <Button variant="ghost" className="text-greentrail-600 hover:text-greentrail-800 hover:bg-greentrail-100 dark:text-greentrail-400 dark:hover:text-greentrail-200 dark:hover:bg-greentrail-900">
              View All <Compass className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {minnesotraTrails.map((trail) => (
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
