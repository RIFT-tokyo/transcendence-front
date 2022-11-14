import { useEffect, useRef } from 'react'

function useKeyPress(target: string[], event: (pressed: boolean) => void) {
  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => target.indexOf(key) !== -1 && event(true)
    const upHandler = ({ key }: KeyboardEvent) => target.indexOf(key) !== -1 && event(false)
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])
}

function useControls() {
  const keys = useRef({
    // forward: false,
    // backward: false,
    left: false,
    right: false,
    // reset: false,
  })
  // useKeyPress(['ArrowUp', 'w'], (pressed) => (keys.current.forward = pressed))
  // useKeyPress(['ArrowDown', 's'], (pressed) => (keys.current.backward = pressed))
  useKeyPress(['ArrowLeft', 'a'], (pressed) => {keys.current.left = pressed})
  useKeyPress(['ArrowRight', 'd'], (pressed) => {keys.current.right = pressed})
  // useKeyPress(['r'], (pressed) => (keys.current.reset = pressed))
  return keys
}

export default useControls;