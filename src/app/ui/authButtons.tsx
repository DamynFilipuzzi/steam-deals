"use client";

import { LogOut, User } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export function SignIn() {
  return (
    <button
      className="group rounded-full border-2 border-identity-default px-1 py-1 font-semibold text-primary no-underline hover:border-identity-hover active:border-identity-focus"
      onClick={() => signIn("", { callbackUrl: "/authCheck" })}
    >
      <div className="sr-only">Sign In</div>
      <User
        size={32}
        className="text-identity-default group-hover:text-identity-hover group-active:text-identity-focus"
      />
    </button>
  );
}

export function SignOut() {
  return (
    <button
      className="block w-full px-4 py-3 text-left text-sm text-primary hover:bg-foreground/10 hover:text-identity-default active:text-identity-focus"
      onClick={() => signOut()}
    >
      Sign Out
      <LogOut className="ml-2 inline" size={18} />
    </button>
  );
}
