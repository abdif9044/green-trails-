
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, Users, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)"),
  meetingPoint: z.string().min(3, "Meeting point is required")
});

interface GroupHikeSchedulerProps {
  trailId: string;
  trailName: string;
}

const GroupHikeScheduler: React.FC<GroupHikeSchedulerProps> = ({ trailId, trailName }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [scheduledHikes, setScheduledHikes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: `Hike at ${trailName}`,
      description: "",
      time: "10:00",
      meetingPoint: "Trailhead entrance"
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to schedule a group hike.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here we would normally save to Supabase
      // For now we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to our local state for demo purposes
      const newHike = {
        id: `hike-${Date.now()}`,
        ...values,
        organizer: user.email,
        participants: [user.id],
        trail_id: trailId,
        trail_name: trailName
      };
      
      setScheduledHikes([...scheduledHikes, newHike]);
      
      toast({
        title: "Hike scheduled!",
        description: `Your hike on ${values.date.toLocaleDateString()} at ${values.time} has been scheduled.`
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error scheduling hike:", error);
      toast({
        title: "Failed to schedule",
        description: "There was an error scheduling your hike.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = (hikeId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join a group hike.",
        variant: "destructive"
      });
      return;
    }
    
    // Update local state for demo
    setScheduledHikes(
      scheduledHikes.map(hike => 
        hike.id === hikeId 
          ? {
              ...hike,
              participants: [...hike.participants, user.id]
            }
          : hike
      )
    );
    
    toast({
      title: "Joined hike!",
      description: "You have successfully joined this group hike."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-greentrail-600" />
            <span>Group Hikes</span>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-greentrail-600 hover:bg-greentrail-700">
                <Plus className="h-4 w-4 mr-1" />
                Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule a Group Hike</DialogTitle>
                <DialogDescription>
                  Plan a hike and invite others to join you on the trail.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Share any details about your hike plan.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col space-y-4">
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="meetingPoint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meeting Point</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-greentrail-600 hover:bg-greentrail-700"
                    >
                      {isLoading ? "Scheduling..." : "Schedule Hike"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Join or organize group hikes on this trail
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {scheduledHikes.length > 0 ? (
          <div className="space-y-4">
            {scheduledHikes.map((hike) => (
              <div 
                key={hike.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{hike.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {new Date(hike.date).toLocaleDateString()} at {hike.time}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleJoin(hike.id)}
                    disabled={user && hike.participants.includes(user.id)}
                  >
                    {user && hike.participants.includes(user.id) ? "Joined" : "Join"}
                  </Button>
                </div>
                
                {hike.description && (
                  <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                    {hike.description}
                  </p>
                )}
                
                <div className="flex items-center gap-1 mt-3">
                  <Users className="h-4 w-4 text-greentrail-500" />
                  <span className="text-xs">
                    {hike.participants.length} {hike.participants.length === 1 ? "person" : "people"} joined
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No scheduled hikes for this trail yet.</p>
            <p className="text-sm mt-1">Be the first to organize a group hike!</p>
          </div>
        )}
      </CardContent>
      
      {!user && (
        <CardFooter className="bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-center w-full text-gray-600 dark:text-gray-400">
            Sign in to schedule or join group hikes
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default GroupHikeScheduler;
