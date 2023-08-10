/**
 * @link https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 */

import { useEffect, useRef, MutableRefObject, ChangeEventHandler, ChangeEvent } from "react"

const useOutsideClick = (ref: MutableRefObject<HTMLElement|null>, cb:(() => void)) => {
  useEffect(() => {
    const handleClickOutside = (evt:MouseEvent) => {
      
      if (ref.current 
          && evt?.target
          && !ref.current.contains(evt?.target as Node)) cb()
    }

    document.addEventListener("mousedown", handleClickOutside)
    //cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [cb, ref])
}

export default useOutsideClick
