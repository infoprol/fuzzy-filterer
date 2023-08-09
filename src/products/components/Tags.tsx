"use client"

import styles from "./Tags.module.css"

const rgbFor = (txt: string) => {
  //get ascii
  const codePoints: number[] = txt.split("").map((x) => x.charCodeAt(0))
  while (codePoints.length < 6) {
    codePoints.push(...codePoints)
  }
  const colors: number[] = []
  for (let i = 0; i < 6 && i < codePoints.length - 1; i + 2) {
    const c = codePoints[i] as number
    const d = codePoints[i + 1] as number

    colors.push(c + d)
  }

  // dont want unicode to blow us up, just in case...
  const colorCode =
    "#" +
    colors
      .map((x) => x % 255)
      .map((x) => x.toString(16))
      .join("")

  return colorCode
}

export interface TagProps {
  tag: string
  toggleTag: (string) => void
}

const consTag = (toColor: (string) => string) => {
  return ({ tag, toggleTag }: TagProps) => {
    const color = toColor(tag)

    return (
      <div
        className={styles.card}
        onClick={(e) => toggleTag(tag)}
        style={{ backgroundColor: color }}
      >
        {`${tag}`}
      </div>
    )
  }
}

export const Tag = consTag(rgbFor)

export interface TagsProps {
  tags: string[]
  activeTags?: string[] | undefined
  toggleTag: (string) => void
}

const Tags = ({ tags, toggleTag, activeTags = [] }: TagsProps) => {
  console.log(`rendering Tags(${tags})`)
  return (
    <div className={styles.tagsContainer}>
      <ul>
        {tags.map((tag, indx) => {
          const isActive = activeTags.includes(tag) ? ` ${styles.activeTag}` : ""
          const className = `${styles.tag}${isActive}`

          return (
            <li key={indx} className={className} onClick={(e) => toggleTag(tag)}>{`${tag}`}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default Tags
