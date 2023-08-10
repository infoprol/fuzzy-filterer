/**
 * @link https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 */

import { useEffect } from "react"

const useOutsideClick = (ref, cb) => {
  useEffect(() => {
    const handleClickOutside = (evt) => {
      if (ref.current && !ref.current.contains(evt.target)) cb()
    }

    document.addEventListener("mousedown", handleClickOutside)
    //cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [cb, ref])
}

export default useOutsideClick
