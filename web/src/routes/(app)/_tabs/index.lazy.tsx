import Example from '@/example-code-delete-me/Example'
import usePageNavigation from '@/hooks/usePageNavigation'
import { createLazyFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export const Route = createLazyFileRoute('/(app)/_tabs/')({
  component: Page,
})

function Page() {
  const { motionProps } = usePageNavigation()

  return (
    <motion.div {...motionProps} className="h-full w-full flex flex-col items-center justify-center">
      <Example />
    </motion.div>
  )
}
