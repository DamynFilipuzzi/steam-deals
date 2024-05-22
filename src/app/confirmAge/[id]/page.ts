import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return redirect(`/game/${params.id}`);
}
