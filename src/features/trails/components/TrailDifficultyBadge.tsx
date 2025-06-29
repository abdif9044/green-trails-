
import { Badge } from "@/components/ui/badge";
import { TrailDifficulty } from "@/types/trails";

interface TrailDifficultyBadgeProps {
  difficulty: TrailDifficulty;
}

const getDifficultyColor = (difficulty: TrailDifficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-500';
    case 'moderate': return 'bg-blue-500';
    case 'hard': return 'bg-red-500';
    case 'expert': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export const TrailDifficultyBadge = ({ difficulty }: TrailDifficultyBadgeProps) => {
  return (
    <Badge className={`${getDifficultyColor(difficulty)} text-white capitalize`}>
      {difficulty}
    </Badge>
  );
};
