import { useContext } from 'react'
import BrightSideContext from './BrightSideContext'

export default function useBrightSideContext() {
  const context = useContext(BrightSideContext)
  if (!context) throw new Error('BrightSide Context must be used within a BrightSideProvider')
  return context
}
