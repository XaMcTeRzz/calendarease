
import { Calendar, Home, Mic, Bell, Menu } from "lucide-react";
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
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold text-primary">CalendarEase</h2>
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Меню</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="flex items-center space-x-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
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
