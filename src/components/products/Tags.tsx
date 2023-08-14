"use client";

import { useSearchParams } from "next/navigation";
import styles from "./Tags.module.css";
import { useRouter } from "next/router";
export interface TagsProps {
  availableTags?: string[] | undefined;
}

const Tags = ({ availableTags = [] }: TagsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchText = (searchParams.get("searchText") || "") as string;
  const activeTags = searchParams.getAll("tags") || [];

  const toggleTag = (tag: string) => {
    const newTags = activeTags.includes(tag)
      ? activeTags.filter((x) => x !== tag)
      : [...activeTags, tag];

    const qs = new URLSearchParams({ searchText });
    for (const t of activeTags) qs.append("tags", `${encodeURIComponent(t)}}`);

    router.replace(`/?${qs}`);
  };

  console.log(`rendering Tags(${availableTags})`);
  return (
    <div className={styles.tagsContainer}>
      <ul>
        {availableTags.map((tag, indx) => {
          const isActive = activeTags.includes(tag)
            ? ` ${styles.activeTag}`
            : "";
          const className = `${styles.tag}${isActive}`;

          return (
            <li
              key={indx}
              className={className}
              onClick={(e) => toggleTag(tag)}
            >{`${tag}`}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tags;
