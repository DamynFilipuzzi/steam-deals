"use client";

import { useRouter } from "next/navigation";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import Cookies from "universal-cookie";

export default function ContentWarning(props: { warn: boolean }) {
  // Fix Hydration Error. Sets isOpen to be true after component mounts
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    if (props.warn) {
      setIsOpen(true);
    }
  }, [props.warn]);

  const router = useRouter();

  const setCookies = () => {
    const cookies = new Cookies();
    cookies.set("ageVerify", "true", { path: "/" });
    router.refresh();
  };

  if (props.warn) {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              This game contains mature content
            </AlertDialogTitle>
            <AlertDialogDescription>
              By clicking view game you are confirming that you are over the age
              of 18 and would like to view mature content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.back()}>
              Back
            </AlertDialogCancel>
            <AlertDialogAction onClick={setCookies}>
              View Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return;
}
