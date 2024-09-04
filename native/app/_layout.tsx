import BrightSideProvider from '@/context/brightside/BrightSideProvider'
import App from './App'

const ThemeColors = {
  light: {
    backgroundColor: '#ffffff',
  },
  dark: {
    backgroundColor: '#020817',
  },
}

export default function RootLayout() {
  return (
    <BrightSideProvider theme={ThemeColors}>
      <App />
    </BrightSideProvider>
  )
}
