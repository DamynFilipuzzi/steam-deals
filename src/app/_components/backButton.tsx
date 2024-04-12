"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="row-start-1 w-min justify-self-start text-lg text-slate-200 underline"
      type="button"
      onClick={() => router.back()}
    >
      Back
    </button>
  );
}
