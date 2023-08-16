import { default as pf } from "@/lib/products";
import { parseListOfTags, toQs } from "@/lib";
import { Product } from "@/lib/types";
import { Tags, SearchBar, SearchResults } from "@/components/products";
import { ComponentProps } from "react";
import ProductSearch from "@/components/products/ProductSearch";
import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";
import ImmediateServerActionCaller from "@/components/ImmediateServerActionCaller";

export default async function Home({
  searchParams: { searchText = "", tags = "" },
}: {
  searchParams: { searchText: string; tags: string };
}) {
  console.log(
    `rendering root ssc page - searchParams: ${JSON.stringify({
      searchText,
      tags,
    })}`,
  );

  const activeTags = parseListOfTags(tags) || [];
  const qs = toQs({ searchText, tags: activeTags });
  const toUri = `/products/?${qs}`;

  async function callMe() {
    "use server";

    console.log(
      `im callMe and someone called me - presumably a client component.`,
    );
    console.log(`redirecting to ${toUri}...`);

    redirect(toUri, RedirectType.replace);
  }

  return (
    <div>
      <h3>redirecting to product search...</h3>
      <ImmediateServerActionCaller callMe={callMe} />
    </div>
  );
}
