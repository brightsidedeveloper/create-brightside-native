import usePageNavigation from '@/hooks/usePageNavigation'
import { createLazyFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export const Route = createLazyFileRoute('/(app)/_tabs/calculated')({
  component: Index,
})

function Index() {
  const { motionProps } = usePageNavigation()

  return (
    <motion.div {...motionProps} className="h-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Create</h1>
    </motion.div>
  )
}
