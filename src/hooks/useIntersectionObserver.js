import { useEffect } from "react"
import * as IOManager from "../util/visible"

export function useIntersectionObserver() {
  useEffect(() => {
    IOManager.init()
    return () => {
      IOManager.destroy()
    }
  }, [])

  useEffect(() => {
    IOManager.refreshObserver()
  })
}
