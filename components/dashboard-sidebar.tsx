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

interface DashboardSidebarProps {
  conversations: Conversation[];
}

export function DashboardSidebar({ conversations }: DashboardSidebarProps) {
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
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 h-full">
        <ScrollArea className="h-full overflow-y-auto border-r">
          <aside
            className={cn(
              isSidebarExpanded ? "w-[220px] xl:w-[260px]" : "w-[68px]",
              "hidden h-screen md:block"
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center gap-2 p-4 lg:h-[60px]">
                {/* {isSidebarExpanded ? <ProjectSwitcher /> : null} */}
                {isSidebarExpanded ? (
                  <div className="flex w-full items-center">
                    <Link href="/" className="flex items-center space-x-2">
                      <Icons.logo className="size-6" />
                      <span className="font-urban text-lg font-bold">
                        CPU RAG
                      </span>
                    </Link>
                  </div>
                ) : null}

                <Button
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose size={18} />
                  ) : (
                    <PanelRightClose size={18} />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                <div className="flex flex-col">
                  {isSidebarExpanded ? (
                    <Link
                      href={`/`}
                      className={cn(
                        "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted"
                      )}
                    >
                      <Icons.filePenLine className="size-6" />
                      New Chat
                    </Link>
                  ) : (
                    <Icons.filePenLine className="size-6" />
                  )}
                  {isSidebarExpanded ? (
                    <Link
                      href={`/`}
                      className={cn(
                        "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted"
                      )}
                    >
                      <Icons.search className="size-6" />
                      Search chats
                    </Link>
                  ) : (
                    <Icons.search className="size-6" />
                  )}
                </div>

                <section
                  key={"conversations"}
                  className="flex flex-col gap-0.5"
                >
                  {isSidebarExpanded ? (
                    <p className="text-xs text-muted-foreground">
                      Conversations
                    </p>
                  ) : (
                    <div className="h-4" />
                  )}
                  {conversations.map((conversation) => (
                    <ScrollArea>
                      <Fragment key={conversation.id}>
                        {isSidebarExpanded ? (
                          <Link
                            href={`/c/${conversation.id}`}
                            key={`link-${conversation.title}`}
                            className={cn(
                              "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted",
                              path === `/c/${conversation.id}`
                                ? "bg-muted"
                                : "text-muted-foreground hover:text-accent-foreground"
                            )}
                          >
                            {conversation.title}
                          </Link>
                        ) : (
                          <Tooltip key={`tooltip-${conversation.title}`}>
                            <TooltipTrigger asChild>
                              <Link
                                key={`link-tooltip-${conversation.title}`}
                                href={`/c/${conversation.id}`}
                                className={cn(
                                  "flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-muted",
                                  path === `/c/${conversation.id}`
                                    ? "bg-muted"
                                    : "text-muted-foreground hover:text-accent-foreground"
                                )}
                              ></Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {conversation.title}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </Fragment>
                    </ScrollArea>
                  ))}
                </section>
              </nav>
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
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
