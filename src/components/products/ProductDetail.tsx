"use client";

import { useRouter } from "next/navigation";
import Tags from "./Tags";
import { Product } from "@/lib/types";
import Image from "next/image";

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();

  const onTagSelect = (tag: string) => {
    router.push(`/?searchText=&tags=${tag}`);
  };

  return (
    <>
      <Tags tags={product.tags} toggleTag={onTagSelect} />
      <div>
        <h1>Product {product.id}</h1>

        <h3>{product.name}</h3>
        <p>{product.about}</p>
        <Image
          src={`/img/${product.legacyId}.png`}
          alt=""
          height={480}
          width={480}
        />

        <pre>{JSON.stringify(product, null, 2)}</pre>
      </div>
    </>
  );
}
