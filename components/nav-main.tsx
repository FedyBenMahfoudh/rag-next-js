"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Conversation, sidebarNavItem } from "@/types";
import { Icons } from "./icons";
import { SearchCommands } from "./search-command";
import { useState } from "react";
import { redirect } from "next/navigation";

export function NavMain({
  items,
  conversations,
}: {
  items: sidebarNavItem[];
  conversations: Conversation[];
}) {
  const iconMap = {
    filePenLine: Icons.filePenLine,
    search: Icons.search,
    // add other icons as needed
  };
  const [open, setOpen] = useState(false);
  return (
    <SidebarGroup>
      <SidebarGroupLabel> Features </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          if (item.icon === "search")
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => setOpen(true)}
                >
                  <Icons.search />
                  <span>Search Chats</span>
                </SidebarMenuButton>
                <SearchCommands
                  open={open}
                  setOpen={setOpen}
                  conversations={conversations}
                />
              </SidebarMenuItem>
            );
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => {if(item.url) redirect(item?.url)}}
              >
                {item.icon && <Icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
