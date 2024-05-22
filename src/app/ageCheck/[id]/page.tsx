"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col gap-5 text-center">
        <h1 className="text-3xl">This game contains mature content</h1>
        <p>
          By clicking view game you are confirming that you are over the age of
          18 and would like to view mature content.
        </p>
      </div>
      <form action={`/confirmAge/${params.id}`}>
        <div className="mt-5 flex flex-row gap-5">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button type="submit">View Game</Button>
        </div>
      </form>
    </main>
  );
}
