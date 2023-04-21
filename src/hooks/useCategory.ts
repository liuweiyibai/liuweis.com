import { useEffect, useState, useCallback, SetStateAction } from "react"
import qs from "query-string"
import { CATEGORY_TYPE } from "../constants"
import * as ScrollManager from "../util/scroll"

const DEST_POS = 316

export function useCategory() {
  const [category, setCategory] = useState<any>(CATEGORY_TYPE.ALL)
  const selectCategory = useCallback((category: any) => {
    setCategory(category)
    ScrollManager.go(DEST_POS)
    window.history.pushState(
      { category },
      "",
      `${window.location.pathname}?${qs.stringify({ category })}`
    )
  }, [])
  const changeCategory: any = useCallback((withScroll = true) => {
    const { category } = qs.parse(location.search)
    const target = category == null ? CATEGORY_TYPE.ALL : category

    setCategory(target)
    withScroll && ScrollManager.go(DEST_POS)
  }, [])

  useEffect(() => {
    ScrollManager.init()
    return () => {
      ScrollManager.destroy()
    }
  }, [])

  useEffect(() => {
    window.addEventListener("popstate", changeCategory)

    return () => {
      window.removeEventListener("popstate", changeCategory)
    }
  }, [])

  useEffect(() => {
    changeCategory(false)
  }, [])

  return [category, selectCategory]
}
