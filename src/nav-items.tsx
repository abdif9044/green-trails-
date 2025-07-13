
import { HomeIcon, MapIcon, UserIcon, SearchIcon } from "lucide-react";
import Index from "./pages/Index";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Trails",
    to: "/trails",
    icon: <MapIcon className="h-4 w-4" />,
    page: <div>Trails Coming Soon</div>,
  },
  {
    title: "Search",
    to: "/search",
    icon: <SearchIcon className="h-4 w-4" />,
    page: <div>Search Coming Soon</div>,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
    page: <div>Profile Coming Soon</div>,
  },
];
