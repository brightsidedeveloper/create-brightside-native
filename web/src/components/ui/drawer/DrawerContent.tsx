import * as React from 'react'

import { Button } from '../shadcn/ui/button'
import {
  DrawerClose,
  DrawerContent as RDrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../shadcn/ui/drawer'
import { BrightBaseAuth, wetToast } from 'bsdweb'

const auth = new BrightBaseAuth()

export function DrawerContent() {
  const [loading, setLoading] = React.useState(false)

  const login = () => {
    auth
      .first(() => setLoading(true))
      .signInWithEmail({ email: 'tim@brightsidedeveloper.com', password: 'password123' })
      .then(() => wetToast('Logged in successfully', { icon: '🎉' }))
      .catch((error: Error) => wetToast(error.message, { icon: '❌' }))
      .finally(() => setLoading(false))
  }

  const signUp = () => {
    auth
      .first(() => setLoading(true))
      .signUpWithEmail({ email: 'tim@brightsidedeveloper.com', password: 'password' })
      .then(() => wetToast('Check your email, then login', { icon: '🎉' }))
      .catch((error: Error) => wetToast(error.message, { icon: '❌' }))
      .finally(() => setLoading(false))
  }

  const logout = () => {
    auth
      .first(() => setLoading(true))
      .signOut()
      .then(() => wetToast('Logged out successfully', { icon: '👋' }))
      .catch((error: Error) => wetToast(error.message, { icon: '❌' }))
      .finally(() => setLoading(false))
  }

  const resetPassword = () => {
    auth
      .first(() => setLoading(true))
      .resetPassword({ email: 'tim@brightsidedeveloper.com' })
      .then(() => wetToast('Check your email to reset your password', { icon: '🎉' }))
      .catch((error: Error) => wetToast(error.message, { icon: '❌' }))
      .finally(() => setLoading(false))
  }

  const changePassword = () => {
    auth
      .first(() => setLoading(true))
      .updatePassword({ newPassword: 'password123' })
      .catch((error: Error) => wetToast(error.message, { icon: '❌' }))
      .finally(() => setLoading(false))
  }

  return (
    <RDrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="flex gap-4 items-center">
          <Button disabled={loading} onClick={login}>
            Login
          </Button>
          <Button disabled={loading} onClick={signUp} variant="outline">
            Sign Up
          </Button>
          <Button disabled={loading} onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <Button disabled={loading} onClick={changePassword} variant="outline">
            Change Password
          </Button>
          <Button disabled={loading} onClick={resetPassword} variant="outline">
            Reset Password
          </Button>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </RDrawerContent>
  )
}
