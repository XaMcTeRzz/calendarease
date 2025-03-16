
import { Calendar, Home, Mic, Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Головна",
    icon: Home,
    href: "/",
  },
  {
    title: "Календар",
    icon: Calendar,
    href: "/calendar",
  },
  {
    title: "Нагадування",
    icon: Bell,
    href: "/reminders",
  },
  {
    title: "Голосові замітки",
    icon: Mic,
    href: "/voice-notes",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-gray-100">CalendarEase</h2>
        <SidebarTrigger className="text-gray-400 hover:text-gray-100">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Меню</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.href} 
                      className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md px-3 py-2 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
