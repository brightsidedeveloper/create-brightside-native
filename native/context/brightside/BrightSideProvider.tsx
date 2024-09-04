import React, { useCallback, useMemo, useRef, useState } from 'react'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import BrightSideContext from './BrightSideContext'
import * as Notifications from 'expo-notifications'
import { SplashScreen } from 'expo-router'
import { useColorScheme } from 'react-native'

SplashScreen.preventAutoHideAsync()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

interface BrightSideProviderProps extends UseBrightSideProps {
  children: React.ReactNode
}

export default function BrightSideProvider({ children, ...props }: BrightSideProviderProps) {
  const context = useBrightSide(props)
  return <BrightSideContext.Provider value={context}>{children}</BrightSideContext.Provider>
}

interface BrightSideTheme {
  dark: { backgroundColor: string }
  light: { backgroundColor: string }
}

interface UseBrightSideProps {
  theme?: BrightSideTheme
}

function useBrightSide({ theme: fullTheme }: UseBrightSideProps) {
  const colorScheme = useColorScheme()
  const [loaded, setLoaded] = useState(false)

  const theme = useMemo(() => {
    if (!fullTheme) return { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
    const scheme = colorScheme === 'dark' ? 'dark' : 'light'
    return fullTheme[scheme]
  }, [colorScheme, fullTheme])

  const webviewRef = useRef<WebView>(null)

  const onMessageListenersRef = useRef<Record<string, (data: unknown) => void>>({})

  const handleMessage = useCallback((e: WebViewMessageEvent) => {
    const { key, data } = JSON.parse(e.nativeEvent.data)
    onMessageListenersRef.current[key]?.(data)
  }, [])

  const addListener = useCallback((key: string, callback: (data: unknown) => void) => {
    if (onMessageListenersRef.current[key]) throw new Error(`Listener with key ${key} already exists`)
    onMessageListenersRef.current[key] = callback
  }, [])

  const removeListener = useCallback((key: string) => {
    delete onMessageListenersRef.current[key]
  }, [])

  const sendMessage = useCallback((key: string, data: unknown) => {
    if (!webviewRef.current) throw new Error('webviewRef from useNative must be attached to Webview')
    webviewRef.current.injectJavaScript(`
              window.postMessage(${JSON.stringify({ key, data })}, '*')
            `)
  }, [])

  const handleLoadEnd = useCallback(() => {
    setTimeout(() => {
      SplashScreen.hideAsync()
      setLoaded(true)
    }, 1000)
  }, [])

  return useMemo(
    () => ({
      webviewRef,
      loaded,
      theme,
      sendMessage,
      handleMessage,
      addListener,
      removeListener,
      handleLoadEnd,
    }),
    [loaded, theme, sendMessage, handleMessage, addListener, removeListener, handleLoadEnd]
  )
}

export type BrightSideContextType = ReturnType<typeof useBrightSide>
