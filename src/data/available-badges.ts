
import { Badge } from "@/types/badges";

export const availableBadges: Badge[] = [
  // Distance badges
  {
    id: "distance-rookie",
    name: "Trail Rookie",
    description: "Hiked your first mile on GreenTrails",
    category: "distance",
    icon: "hiking",
    level: 1,
    requirement: "Hike 1 mile total",
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: "distance-explorer",
    name: "Trail Explorer",
    description: "Hiked 10 miles on GreenTrails",
    category: "distance",
    icon: "mountain",
    level: 2,
    requirement: "Hike 10 miles total",
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: "distance-master",
    name: "Trail Master",
    description: "Hiked 50 miles on GreenTrails",
    category: "distance",
    icon: "award",
    level: 3,
    requirement: "Hike 50 miles total",
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  
  // Trails count badges
  {
    id: "trails-starter",
    name: "Trail Starter",
    description: "Visited your first trail",
    category: "trails",
    icon: "flag",
    level: 1,
    requirement: "Visit 1 trail",
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: "trails-adventurer",
    name: "Trail Adventurer",
    description: "Visited 5 different trails",
    category: "trails",
    icon: "compass",
    level: 2,
    requirement: "Visit 5 different trails",
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: "trails-enthusiast",
    name: "Trail Enthusiast",
    description: "Visited 15 different trails",
    category: "trails",
    icon: "map",
    level: 3,
    requirement: "Visit 15 different trails",
    unlocked: false,
    progress: 0,
    maxProgress: 15
  },
  
  // Social badges
  {
    id: "social-friendly",
    name: "Friendly Explorer",
    description: "Made your first friend on GreenTrails",
    category: "social",
    icon: "users",
    level: 1,
    requirement: "Connect with 1 friend",
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: "social-connector",
    name: "Trail Connector",
    description: "Connected with 5 friends on GreenTrails",
    category: "social",
    icon: "friends",
    level: 2,
    requirement: "Connect with 5 friends",
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  
  // Streak badges
  {
    id: "streak-starter",
    name: "Consistency Starter",
    description: "Used GreenTrails 3 days in a row",
    category: "streak",
    icon: "calendar",
    level: 1,
    requirement: "3-day streak",
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: "streak-weekly",
    name: "Weekly Warrior",
    description: "Used GreenTrails 7 days in a row",
    category: "streak",
    icon: "flame",
    level: 2,
    requirement: "7-day streak",
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: "streak-committed",
    name: "Committed Hiker",
    description: "Used GreenTrails 30 days in a row",
    category: "streak",
    icon: "badge",
    level: 3,
    requirement: "30-day streak",
    unlocked: false,
    progress: 0,
    maxProgress: 30
  },
  
  // Cannabis-friendly badges
  {
    id: "cannabis-explorer",
    name: "420 Explorer",
    description: "Visited your first cannabis-friendly trail",
    category: "cannabis",
    icon: "leaf",
    level: 1,
    requirement: "Visit 1 cannabis-friendly trail",
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: "cannabis-enthusiast",
    name: "Green Enthusiast",
    description: "Visited 5 cannabis-friendly trails",
    category: "cannabis",
    icon: "star",
    level: 2,
    requirement: "Visit 5 cannabis-friendly trails",
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
];
