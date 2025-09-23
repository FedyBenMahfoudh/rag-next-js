import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Conversation } from "@/types";
import { Icons } from "./icons";
import { SidebarMenuButton } from "./ui/sidebar";

export const SearchCommands = ({
  open,
  setOpen,
  conversations,
}: {
  conversations: Conversation[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a title for conversations..." />
        <ScrollArea>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup key={"conversations"} heading={"Conversations"}>
              {conversations.flatMap((item) => {
                return (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      runCommand(() => router.push(`/chat/c/${item.id}` as string));
                    }}
                  >
                    <Icons.messageCircle className="mr-2 size-5" />
                    {item.title}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </ScrollArea>
      </CommandDialog>
    </>
  );
};
