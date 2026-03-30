"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";
import { useAuthStore } from "@/store/useAuthStore";
import { getMe } from "@/lib/api";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, clearUser, setHydrated } = useAuthStore();

  useEffect(() => {
    getMe()
      .then((user) => {
        if (user?.id) {
          setUser(user);
        } else {
          clearUser();
          router.replace("/login");
        }
      })
      .catch(() => {
        clearUser();
        router.replace("/login");
      })
      .finally(setHydrated);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {children}
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
