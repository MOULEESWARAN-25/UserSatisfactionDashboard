import type { Service } from "@/types/feedback";

export const SERVICES: Service[] = [
  {
    id: "cafeteria",
    name: "Cafeteria",
    icon: "🍽️",
    questions: [
      { id: "food_quality", label: "Food Quality" },
      { id: "hygiene", label: "Hygiene & Cleanliness" },
      { id: "staff_behavior", label: "Staff Behavior" },
      { id: "waiting_time", label: "Waiting Time" },
      { id: "menu_variety", label: "Menu Variety" },
    ],
  },
  {
    id: "library",
    name: "Library",
    icon: "📚",
    questions: [
      { id: "book_availability", label: "Book Availability" },
      { id: "quietness", label: "Quietness" },
      { id: "seating_space", label: "Seating Space" },
      { id: "staff_support", label: "Staff Support" },
    ],
  },
  {
    id: "online-course",
    name: "Online Course",
    icon: "💻",
    questions: [
      { id: "content_quality", label: "Content Quality" },
      { id: "platform_usability", label: "Platform Usability" },
      { id: "instructor_support", label: "Instructor Support" },
      { id: "video_quality", label: "Video Quality" },
    ],
  },
  {
    id: "hostel",
    name: "Hostel",
    icon: "🏠",
    questions: [
      { id: "room_cleanliness", label: "Room Cleanliness" },
      { id: "facilities", label: "Facilities" },
      { id: "security", label: "Security" },
      { id: "warden_support", label: "Warden Support" },
      { id: "wifi_connectivity", label: "WiFi Connectivity" },
    ],
  },
  {
    id: "campus-event",
    name: "Campus Event",
    icon: "🎉",
    questions: [
      { id: "organization", label: "Organization" },
      { id: "content_relevance", label: "Content Relevance" },
      { id: "venue_quality", label: "Venue Quality" },
      { id: "timing", label: "Timing & Schedule" },
    ],
  },
];

export const SERVICE_MAP = Object.fromEntries(
  SERVICES.map((s) => [s.id, s])
);

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Feedback", href: "/feedback", icon: "MessageSquare" },
  { label: "Services", href: "/services", icon: "Grid3x3" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Reports", href: "/reports", icon: "FileText" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];
