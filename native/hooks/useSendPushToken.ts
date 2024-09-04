import useWebViewListener from './useWebViewListener'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { z } from 'zod'
import useWebView from './useWebView'

export default function useSendPushToken() {
  const { sendMessage } = useWebView()
  useWebViewListener(
    'getPushToken',
    () =>
      registerForPushNotificationsAsync()
        .then((token) => sendMessage('getPushToken', token))
        .catch(() => sendMessage('getPushToken', { type: 'error', token: null })),
    z.any()
  )
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications')
    return null
  }

  const getToken = async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId

    if (!projectId) {
      console.log('Project ID not found. Ensure it is set in your expo configuration.')
      return null
    }

    return await Notifications.getExpoPushTokenAsync({ projectId })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  if (existingStatus === 'granted') return getToken()

  const { status } = await Notifications.requestPermissionsAsync()
  if (status === 'granted') return getToken()

  console.log('Failed to get push token for push notification!')

  return null
}
