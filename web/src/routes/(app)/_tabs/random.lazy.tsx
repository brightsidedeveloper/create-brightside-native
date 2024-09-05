import { Button } from '@/components/ui/shadcn/ui/button'
import usePageNavigation from '@/hooks/usePageNavigation'
import { createLazyFileRoute } from '@tanstack/react-router'
import { BrightBaseAuth } from 'bsdweb'
import { motion } from 'framer-motion'

const auth = new BrightBaseAuth()

export const Route = createLazyFileRoute('/(app)/_tabs/random')({
  component: Page,
})

function Page() {
  const { motionProps, navigate: navAnimation } = usePageNavigation()

  return (
    <motion.div {...motionProps} className="h-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Page</h1>
      <br />
      <Button
        onClick={async () => {
          await auth.signOut()
          navAnimation('/join', 1)
        }}
      >
        Sign Out
      </Button>
    </motion.div>
  )
}
