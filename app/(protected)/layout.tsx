import React from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { redirect } from "next/navigation";
import { getUser} from "@/actions/user.action";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset >
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
