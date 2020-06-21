import { useEffect } from 'react'

function useEventCallback(x, eventType, callback) {
  useEffect(() => {
    if (x) {
      x.on(eventType, callback)
    }
  }, [x])
}

export default useEventCallback
