"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "./Tags.module.css";
import { DEBOUNCE_MILLI_SEC, toQs } from "@/lib";
import { useEffect, useState } from "react";
export interface TagsProps {
  availableTags: string[];
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
}

const Tags = (props: TagsProps) => {
  //   availableTags = [],
  //   activeTags = [],
  //   setActiveTags: (tags: string[]) => void,
  //   searchText = "",
  // }: TagsProps) => {
  const router = useRouter();

  console.log(`Tag`);
  //
  //   const [activeTagsDic, setActiveTagsDic] = useState<Record<string, boolean>>(
  //     () =>
  //       availableTags.reduce(
  //         (acc, tag) => ({ ...acc, [tag]: activeTags.includes(tag) }),
  //         {},
  //       ),
  //   );

  const { activeTags, availableTags, setActiveTags } = props;

  const toggleTag = (tag: string) => {
    const newTags = activeTags.includes(tag)
      ? activeTags.filter((x) => x !== tag)
      : [...activeTags, tag];

    setActiveTags(newTags);
  };
  //
  //   const toggleTag = (tag: string) => {
  //     const newActiveTags = Object.keys({
  //       ...d,
  //       [tag]: !d[`${tag}`],
  //     })
  //       .map((k) => [k, activeTagsDic[k]])
  //       .filter(([t, isActive]) => isActive)
  //       .map(([t, isActive]) => t)
  //       .sort() as string[];
  //
  //     setActiveTagsDic();ß
  //   };

  console.log(`rendering Tags(${availableTags})`);
  console.log(`...same render, activeTags => ${activeTags}`);
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
