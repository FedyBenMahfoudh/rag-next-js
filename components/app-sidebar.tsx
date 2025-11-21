import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNavMain } from "@/constants/site";
import {getUser} from "@/actions/user.action";
import {getConversations} from "@/actions/conversations.actions";
import {redirect} from "next/navigation";


export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

    const user = await getUser();
    if (!user) {
        redirect("/auth/login");
    }

    const conversations = await getConversations(user?.id);

  return (
    <Sidebar variant={"floating"} collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SidebarNavMain} conversations={conversations} />
        <NavProjects conversations={conversations} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
