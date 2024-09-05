import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useSwipeable } from 'react-swipeable'
import { useState, useMemo, useCallback } from 'react'

const lit = {
  transition: {
    type: 'spring',
    stiffness: 260,
    damping: 25,
  },
}

const order = ['/', '/calculated', '/random']

export default function usePageNavigation() {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const [state, setState] = useState<0 | -1 | 1>(0)

  const currentIndex = useMemo(() => order.indexOf(routerState.location.pathname), [routerState.location.pathname])
  const prevIndex = useMemo(() => order.indexOf(routerState.resolvedLocation.pathname), [routerState.resolvedLocation.pathname])

  let direction = state ?? 1

  // Handle circular navigation
  if (currentIndex > prevIndex) {
    if (currentIndex === order.length - 1 && prevIndex === 0) {
      direction = -1
    } else {
      direction = 1
    }
  } else if (currentIndex < prevIndex) {
    if (currentIndex === 0 && prevIndex === order.length - 1) {
      direction = 1
    } else {
      direction = -1
    }
  }

  const calculateDirection = useCallback(
    (targetIndex: number) => {
      if (targetIndex > currentIndex) {
        if (targetIndex === 0 && currentIndex === order.length - 1) {
          return -1
        }
        return 1
      } else if (targetIndex < currentIndex) {
        if (currentIndex === 0 && targetIndex === order.length - 1) {
          return 1
        }
        return -1
      }
      return 0 // No movement if the target is the current page
    },
    [currentIndex]
  )

  const handleNavigate = useCallback(
    (to: string, direction?: 0 | -1 | 1) => {
      direction ??= calculateDirection(order.indexOf(to))
      setState(direction)
      setTimeout(() => {
        navigate({ to })
      }, 150)
    },
    [calculateDirection, navigate]
  )

  const motionProps = useMemo(() => {
    const baseProps = {
      initial: { transform: `translateX(${100 * direction}%)`, ...lit },
      animate: { transform: 'translateX(0%)', ...lit },
      className: 'size-full',
    }

    if (state) {
      return {
        ...baseProps,
        initial: { transform: 'translateX(0%)', ...lit },
        animate: { transform: `translateX(${100 * direction}%)`, ...lit },
      }
    }

    return baseProps
  }, [direction, state])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNavigate(order[(currentIndex + 1) % order.length], -1),
    onSwipedRight: () => handleNavigate(order[(currentIndex - 1 + order.length) % order.length], 1),
  })

  return {
    motionProps: { ...motionProps, ...swipeHandlers },
    navigate: handleNavigate,
  }
}
