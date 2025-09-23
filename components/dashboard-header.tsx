"use client";
import React from "react";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./mode-toggle";

const DashboardHeader = () => {
  const { isMobile } = useSidebar();
  return (
    <header className="flex border-b-1 border-muted h-16 shrink-0 items-center justify-between px-4 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger className="ml-1" />}
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </div>
      <ModeToggle />
    </header>
  );
};

export default DashboardHeader;
