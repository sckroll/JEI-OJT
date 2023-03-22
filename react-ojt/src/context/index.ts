import { createContext } from "react"
import { initialContents } from "../config"
import { ContentState } from "../types"

const ContentContext = createContext<ContentState[]>(initialContents)

export default ContentContext