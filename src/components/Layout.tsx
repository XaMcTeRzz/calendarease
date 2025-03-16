
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]">
        <AppSidebar />
        <main className="flex-1 p-2 md:p-6 animate-fade-in overflow-x-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
