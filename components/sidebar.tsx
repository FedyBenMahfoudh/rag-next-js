"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Icons } from "@/components/icons";
import { Conversation } from "@/types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar";

interface DashboardSidebarProps {
  conversations: Conversation[];
  props?: React.ComponentProps<typeof Sidebar>;
}

export function UserSidebar({
  conversations,
  ...props
}: DashboardSidebarProps) {
  const path = usePathname();

  // NOTE: Use this if you want save in local storage -- Credits: Hosna Qasmei

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("sidebarExpanded");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "sidebarExpanded",
        JSON.stringify(isSidebarExpanded)
      );
    }
  }, [isSidebarExpanded]);

  const { isTablet } = useMediaQuery();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-row-reverse items-center justify-between"
          >
            <SidebarTrigger />
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="size-6" />
              <span className="font-urban text-lg font-bold">My RAG</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center"
            >
              <Link href={"/"}>
                <Icons.filePenLine size={6} />
                New Chat
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href={"/"}>
                <Icons.search size={6} />
                Search chats
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup
          key={"conversations"}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarMenu>
            {conversations.map((conversation) => (
              <SidebarMenuItem
                key={conversation.id}
                className={cn(
                  "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted",
                  path === `/c/${conversation.id}`
                    ? "bg-muted"
                    : "text-muted-foreground hover:text-accent-foreground"
                )}
              >
                <Link href={`/c/${conversation.id}`}>{conversation.title}</Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={stores.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>  
  );
}

export function MobileSheetSidebar({ conversations }: DashboardSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0 md:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetTitle className="hidden">Mobile sidebar</SheetTitle>
          <SheetDescription className="hidden">
            Access your navigation links in the sidebar
          </SheetDescription>
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 font-semibold"
                >
                  {/* <Icons.logo className="size-6" /> */}
                  <span className="font-urban text-lg font-bold">My-Rag</span>
                </Link>

                {/* <ProjectSwitcher large /> */}

                <section
                  key={"mobile-conversations"}
                  className="flex flex-col gap-0.5"
                >
                  <ScrollArea>
                    {conversations.map((conversation) => {
                      return (
                        <Fragment
                          key={`mobile-conversation-${conversation.id}`}
                        >
                          <Link
                            href={`/c/${conversation.id}`}
                            className={cn(
                              "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted",
                              path === `/c/${conversation.id}`
                                ? "bg-muted"
                                : "text-muted-foreground hover:text-accent-foreground"
                            )}
                          >
                            {conversation.title}
                          </Link>
                        </Fragment>
                      );
                    })}
                  </ScrollArea>
                </section>
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
}
