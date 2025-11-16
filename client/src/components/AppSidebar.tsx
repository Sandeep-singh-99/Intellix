import { CogIcon, Gem, Settings2 } from "lucide-react";
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
  useSidebar,
} from "./ui/sidebar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const MenuOptions = [
  {
    title: "Settings",
    url: "#",
    icon: <Settings2 />,
  },
];

export default function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <CogIcon />
          {open && <h1 className="text-white text-3xl font-bold">Intellix</h1>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuOptions.map((option, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild size={open ? "lg" : "default"}>
                    <Link to={option.url}>
                      {option.icon}
                      <span>{option.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-10">
        <div className="flex gap-2 items-center">
          <Gem />
          {open && <h2>Remaining Credits: 5000</h2>}
        </div>
        {open && <Button>Upgrade to Unlimited</Button>}
      </SidebarFooter>
    </Sidebar>
  );
}
