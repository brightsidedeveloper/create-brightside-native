import { useMemo } from 'react'
import useBrightSideContext from '../context/brightside/useBrightSideContext'

export default function useTheme() {
  const { theme } = useBrightSideContext()
  return useMemo(() => theme, [theme])
}
