import { createContext } from 'react'
import { BrightSideContextType } from './BrightSideProvider'

const BrightSideContext = createContext<BrightSideContextType | null>(null)

export default BrightSideContext
