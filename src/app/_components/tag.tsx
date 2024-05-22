"use client";

import { Badge } from "~/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  data: {
    id: number;
    tag_id: number;
    tag_name: string;
  };
};

export default function Tag({ data }: Props) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  function handleClick(tagId: number) {
    const params = new URLSearchParams(searchParams);
    params.set("byTags", "true");
    params.set("tags", tagId.toString());
    replace(`/?${params.toString()}`);
  }

  return (
    <Badge
      key={data.tag_id + "t"}
      variant={"tags"}
      className="mr-2 mt-2 cursor-pointer"
      onClick={() => handleClick(data.tag_id)}
    >
      {data.tag_name}
    </Badge>
  );
}
