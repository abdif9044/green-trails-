
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar, Target, MapPin, Star } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'distance' | 'elevation' | 'trails' | 'social';
  goal: number;
  progress: number;
  unit: string;
  participants: number;
  endsAt: Date;
  reward: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const SocialChallenges: React.FC = () => {
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Winter Warriors',
      description: 'Complete 5 winter hikes and share your snowy adventures',
      type: 'trails',
      goal: 5,
      progress: 2,
      unit: 'trails',
      participants: 847,
      endsAt: new Date('2024-03-31'),
      reward: 'Winter Warrior Badge',
      difficulty: 'intermediate'
    },
    {
      id: '2',
      title: 'Peak Collector',
      description: 'Reach 10,000ft elevation gain this month',
      type: 'elevation',
      goal: 10000,
      progress: 6500,
      unit: 'ft',
      participants: 324,
      endsAt: new Date('2024-02-29'),
      reward: 'Mountain Master Badge',
      difficulty: 'advanced'
    },
    {
      id: '3',
      title: 'Social Explorer',
      description: 'Make 3 new hiking connections and explore together',
      type: 'social',
      goal: 3,
      progress: 1,
      unit: 'connections',
      participants: 156,
      endsAt: new Date('2024-02-15'),
      reward: 'Community Builder Badge',
      difficulty: 'beginner'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-greentrail-500/20 border-greentrail-500/30 text-greentrail-300';
      case 'intermediate': return 'bg-gold-500/20 border-gold-500/30 text-gold-300';
      case 'advanced': return 'bg-red-500/20 border-red-500/30 text-red-300';
      default: return 'bg-luxury-500/20 border-luxury-500/30 text-luxury-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'distance': return <MapPin className="h-4 w-4" />;
      case 'elevation': return <Target className="h-4 w-4" />;
      case 'trails': return <Star className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <Trophy className="h-5 w-5 text-luxury-900" />
            </div>
            <div>
              <h2 className="text-xl luxury-heading text-white">Active Challenges</h2>
              <p className="text-sm luxury-text text-luxury-400">Join the community and push your limits</p>
            </div>
          </div>
          <Badge className="bg-gold-500/20 border-gold-500/30 text-gold-300 luxury-text">
            3 Active
          </Badge>
        </div>

        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-gold-500/30 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-greentrail-600/20 flex items-center justify-center">
                      {getTypeIcon(challenge.type)}
                    </div>
                    <div>
                      <h3 className="font-luxury font-semibold text-white mb-1">{challenge.title}</h3>
                      <p className="text-sm luxury-text text-luxury-300 mb-2">{challenge.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-luxury-400">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {challenge.participants} joined
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Ends {challenge.endsAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={`luxury-text ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="luxury-text text-luxury-300">
                      {challenge.progress} / {challenge.goal} {challenge.unit}
                    </span>
                    <span className="luxury-text text-luxury-300">
                      {Math.round((challenge.progress / challenge.goal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-luxury-800/50 rounded-full h-2">
                    <div 
                      className="bg-gold-gradient h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((challenge.progress / challenge.goal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Reward and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-gold-400" />
                    <span className="text-sm luxury-text text-luxury-300">{challenge.reward}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-greentrail-600/20 hover:bg-greentrail-600/30 text-greentrail-300 border-greentrail-500/30 luxury-text"
                    variant="outline"
                  >
                    Join Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialChallenges;
