"use client";

import { LogOut, User } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export function SignIn() {
  return (
    <button
      className="border-identity-default hover:border-identity-hover active:border-identity-focus group rounded-full border-2 px-1 py-1 font-semibold text-primary no-underline"
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
      className="hover:text-identity-hover active:border-identity-focus block w-full px-4 py-3 text-left text-sm text-primary"
      onClick={() => signOut()}
    >
      Sign Out
      <LogOut className="ml-2 inline" size={18} />
    </button>
  );
}
