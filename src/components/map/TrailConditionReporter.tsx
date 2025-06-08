
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface TrailCondition {
  id: string;
  type: 'good' | 'caution' | 'closed' | 'info';
  description: string;
  reportedAt: Date;
  reportedBy: string;
}

interface TrailConditionReporterProps {
  trailId: string;
  conditions?: TrailCondition[];
}

const TrailConditionReporter: React.FC<TrailConditionReporterProps> = ({ 
  trailId, 
  conditions = [] 
}) => {
  const [selectedCondition, setSelectedCondition] = useState<'good' | 'caution' | 'closed' | 'info'>('good');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const conditionTypes = [
    { value: 'good', label: 'Good', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'caution', label: 'Caution', icon: AlertTriangle, color: 'bg-yellow-500' },
    { value: 'closed', label: 'Closed', icon: XCircle, color: 'bg-red-500' },
    { value: 'info', label: 'Info', icon: Info, color: 'bg-blue-500' }
  ] as const;

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide details about the trail condition",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically submit to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Condition reported",
        description: "Thank you for helping the community!"
      });
      
      setDescription('');
    } catch (error) {
      toast({
        title: "Report failed",
        description: "Failed to submit trail condition report",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConditionIcon = (type: string) => {
    const conditionType = conditionTypes.find(ct => ct.value === type);
    if (!conditionType) return Info;
    return conditionType.icon;
  };

  const getConditionColor = (type: string) => {
    const conditionType = conditionTypes.find(ct => ct.value === type);
    return conditionType?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Trail Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          {conditions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent condition reports
            </p>
          ) : (
            <div className="space-y-3">
              {conditions.slice(0, 3).map((condition) => {
                const Icon = getConditionIcon(condition.type);
                return (
                  <div key={condition.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                    <div className={`p-1 rounded-full text-white ${getConditionColor(condition.type)}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {condition.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {condition.reportedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{condition.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reported by {condition.reportedBy}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Trail Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Condition Type</label>
            <div className="grid grid-cols-4 gap-2">
              {conditionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={selectedCondition === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCondition(type.value)}
                    className="flex flex-col h-auto py-3"
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the current trail conditions..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrailConditionReporter;
