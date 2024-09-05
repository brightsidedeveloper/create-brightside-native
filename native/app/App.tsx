import BrightSideWebView from '@/components/BrightSideWebView'
import useTheme from '@/hooks/useTheme'
import { View } from 'react-native'

export default function App() {
  const { backgroundColor } = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <View
        style={{
          flex: 1,
          marginTop: 40,
        }}
      >
        <BrightSideWebView url={ENTRY} />
      </View>
    </View>
  )
}

const ENTRY = 'https://app.bsdserv.com'
