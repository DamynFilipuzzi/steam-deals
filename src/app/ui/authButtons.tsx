"use client";

import { LogOut, User } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export function SignIn() {
  return (
    <button
      className="group rounded-full border-2 border-cyan-500 px-1 py-1 font-semibold text-black no-underline hover:border-cyan-300 active:border-cyan-700"
      onClick={() => signIn("", { callbackUrl: "/authCheck" })}
    >
      <div className="sr-only">Sign In</div>
      <User
        size={32}
        className="text-cyan-500 group-hover:text-cyan-300 group-active:text-cyan-700"
      />
    </button>
  );
}

export function SignOut() {
  return (
    <button
      className="block px-4 py-3 text-sm text-white hover:text-cyan-300 active:border-cyan-700"
      onClick={() => signOut()}
    >
      Sign Out
      <LogOut className="ml-2 inline" size={18} />
    </button>
  );
}
