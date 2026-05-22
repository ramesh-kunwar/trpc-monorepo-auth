"use client";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useuser } from "~/hooks/api/auth";
import { api } from "~/trpc/server";

export default function Home() {
  const router = useRouter();
  // const { status } = await api.health.getHealth.query();
  const { user } = useuser();
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/");
    }
  }, [user]);
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">tRPC Monorepo</h1>
        {/* <h2>Server Status: {status}</h2> */}
        <p>User : {JSON.stringify(user)}</p>
      </div>
    </main>
  );
}
