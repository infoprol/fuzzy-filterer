"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "./Tags.module.css";
import { DEBOUNCE_MILLI_SEC, toQs } from "@/lib";
import { useEffect, useState } from "react";
export interface TagsProps {
  availableTags: string[];
  activeTags: string[];
  onTagPicked: (tags: string) => void;
}

const Tags = (props: TagsProps) => {
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

  const { activeTags, availableTags, onTagPicked } = props;

  //
  //   const onTagPicked = (tag: string) => {
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
  const baseTagClass =
    "p-1 text-center rounded-lg flex flex-col justify-center h-fit w-fit m-[0.2rem] text-align-center border-indigo-600 hover:cursor-pointer hover:shadow-md hover:shadow-indigo-400";
  const inactiveTagClass = `bg-sky-300 ${baseTagClass}`;
  const activeTagClass = `bg-[#fcd34d] brightness-200 drop-shadow-2xl ${baseTagClass} border-4 border-lemon-600`;

  console.log(`rendering Tags(${availableTags})`);
  console.log(`...same render, activeTags => ${activeTags}`);
  return (
    <div>
      <ul className="m-[1em] flex flex-wrap justify-center list-none">
        {availableTags.map((tag, indx) => {
          const isActive = activeTags.includes(tag)
            ? ` ${styles.activeTag}`
            : "";

          return (
            <li
              className={isActive ? activeTagClass : inactiveTagClass}
              key={indx}
              onClick={(e) => onTagPicked(tag)}
            >{`${tag}`}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tags;
