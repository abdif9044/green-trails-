
import React from 'react';
import { TrailCard } from "@/features/trails";
import { Trail } from '@/types/trails';
import { Link } from 'react-router-dom';

interface TrailsGridProps {
  trails: Trail[];
}

const TrailsGrid: React.FC<TrailsGridProps> = ({ trails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {trails.map((trail) => (
        <Link to={`/trail/${trail.id}`} key={trail.id}>
          <TrailCard 
            id={trail.id}
            name={trail.name}
            location={trail.location}
            imageUrl={trail.imageUrl}
            difficulty={trail.difficulty}
            length={trail.length}
            elevation={trail.elevation}
            tags={trail.tags}
            likes={trail.likes}
            strainTags={trail.strainTags}
            isAgeRestricted={trail.isAgeRestricted}
          />
        </Link>
      ))}
    </div>
  );
};

export default TrailsGrid;
