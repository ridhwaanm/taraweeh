import { useEffect, useState } from "react";
import { useSession, signOut } from "../../lib/auth-client";
import { Button } from "../ui/button";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import {
  RectangleStackIcon,
  UserGroupIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { SidebarLayout } from "../ui/sidebar-layout";
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarFooter,
} from "../ui/sidebar";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "../ui/navbar";
import { Avatar } from "../ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: "recordings" | "huffadh" | "venues";
}

export function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isPending && !session) {
      window.location.href = "/admin/login";
    }
  }, [session, isPending, mounted]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/admin/login";
  };

  if (!mounted || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem onClick={handleSignOut} aria-label="Sign out">
              <ArrowRightOnRectangleIcon />
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <Avatar
                src="/logo.png"
                className="size-10"
                square
                alt="Taraweeh"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Taraweeh Admin
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {session.user?.email}
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem
                href="/admin/recordings"
                current={currentPage === "recordings"}
              >
                <RectangleStackIcon />
                <SidebarLabel>Recordings</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/admin/huffadh"
                current={currentPage === "huffadh"}
              >
                <UserGroupIcon />
                <SidebarLabel>Huffadh</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/admin/venues"
                current={currentPage === "venues"}
              >
                <MapPinIcon />
                <SidebarLabel>Venues</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter>
            <Button plain onClick={handleSignOut} className="w-full">
              <ArrowRightOnRectangleIcon data-slot="icon" />
              Sign out
            </Button>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
