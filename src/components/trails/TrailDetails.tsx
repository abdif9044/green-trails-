
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownFormatter } from "@/utils/markdown-formatter";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, TrendingUp } from "lucide-react";

interface TrailDetailsProps {
  description?: string;
  difficulty?: string;
  length?: number;
  tags?: string[];
}

const TrailDetails: React.FC<TrailDetailsProps> = ({ 
  description, 
  difficulty = 'moderate',
  length = 0,
  tags = []
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'expert': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trail Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-greentrail-600" />
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <Badge className={getDifficultyColor(difficulty)} variant="outline">
                {difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-greentrail-600" />
              <span className="text-sm text-muted-foreground">Length:</span>
              <span className="font-medium">{length} miles</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-greentrail-600" />
              <span className="text-sm text-muted-foreground">Est. Time:</span>
              <span className="font-medium">{Math.round(length * 30)} min</span>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Trail Features</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <div className="prose max-w-none dark:prose-invert">
              {description ? (
                <MarkdownFormatter content={description} />
              ) : (
                <p className="text-muted-foreground">
                  Discover this beautiful trail and share your experience with the community! 
                  Add photos, rate the difficulty, and help fellow hikers plan their adventure.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrailDetails;
