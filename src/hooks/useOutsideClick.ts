/**
 * @link https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 */

import { useEffect, MutableRefObject } from 'react'

const useOutsideClick = (
  ref: MutableRefObject<HTMLElement | null>,
  cbIfOutside: () => void,
  cbIfInside: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (
        ref.current &&
        evt?.target &&
        !ref.current.contains(evt?.target as Node)
      )
        cbIfOutside()
      // else we are inside
      else cbIfInside()
    }

    document.addEventListener('mousedown', handleClickOutside)
    //cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [cbIfOutside, cbIfInside, ref])
}

export default useOutsideClick
