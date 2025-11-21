"use client";

import * as React from "react";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "./icons";
import { siteConfig } from "@/constants/site";
import {useIsMobile} from "@/hooks/use-mobile";
import {X} from "lucide-react";

export function TeamSwitcher() {
    const { isMobile,setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-row-reverse"
        >
            {isMobile ? <X size={7} onClick={() => setOpenMobile(false)} />:<SidebarTrigger/>}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{siteConfig.name}</span>
          </div>
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Icons.logo className="size-7" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
