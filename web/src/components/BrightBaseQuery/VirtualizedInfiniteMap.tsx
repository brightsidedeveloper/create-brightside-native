import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo } from 'react'
import { c, tw } from 'bsdweb'
import { UseSuspenseVirtualizedInfiniteMapReturn } from '../../hooks/BrightBaseQuery/useSuspenseVirtualizerInfiniteQuery'
import { ScrollArea } from '../ui/shadcn/ui/scroll-area'
import Accordion from '@/components/ui/Accordion'
import { Button } from '@/components/ui/shadcn/ui/button'
import { useCallback, useRef, useState } from 'react'
import { BrightBaseStorage, wetToast } from 'bsdweb'

interface VirtualizedInfiniteMapProps<T extends { [key: string]: unknown }> {
  children: (item: T, index: number) => ReactNode
  className?: string
  loadingComponent?: JSX.Element
  horizontal?: boolean
}

export default function VirtualizedInfiniteMap<T extends { [key: string]: unknown }>({
  className,
  items,
  vItems,
  virtualizer,
  queryRest: { isLoading },
  loadingComponent,
  horizontal,
  setScrollViewMounted,
  children,
}: UseSuspenseVirtualizedInfiniteMapReturn<T> & VirtualizedInfiniteMapProps<T>) {
  const cn = useMemo(() => c('flex', tw(horizontal && 'flex-col'), className), [className, horizontal])
  if (isLoading) return loadingComponent
  return (
    <ScrollArea className={cn}>
      <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${vItems[0]?.start ?? 0}px)`,
          }}
        >
          {vItems.map((vRow) => {
            const item = items[vRow.index]
            if (!item) return loadingComponent
            if (vRow.index === 0) return <WelcomeAndDocs />
            return (
              <div key={vRow.key} data-index={vRow.index} ref={virtualizer.measureElement}>
                {children(item, vRow.index)}
              </div>
            )
          })}
        </div>
      </div>
      <ScrollActiveController setScrollViewMounted={setScrollViewMounted} />
    </ScrollArea>
  )
}

function ScrollActiveController({ setScrollViewMounted }: { setScrollViewMounted: Dispatch<SetStateAction<boolean>> }) {
  useEffect(() => {
    setScrollViewMounted(true)
    return () => setScrollViewMounted(false)
  })

  return null
}

const test_bucket = new BrightBaseStorage('test_bucket')

function WelcomeAndDocs() {
  const [url, setUrl] = useState('/Bright.svg')

  const ref = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return wetToast('No file selected', { icon: '❌' })
    test_bucket
      .uploadFile('test2', file, { upsert: true })
      .then(setUrl)
      .catch((error) => wetToast(error.message, { icon: '❌' }))
  }, [])

  return (
    <div className="p-10 w-full flex justify-center items-center flex-col gap-4 h-[34rem] @container">
      <div className="p-8 rounded-3xl border bg-card shadow-md dark:shadow-xl w-full max-w-[600px]">
        <h3 className="text-3xl @md:text-5xl @2xl:text-7xl pb-5">Welcome Home!</h3>
        <p className="text-xl">Enjoy Coding!</p>
      </div>
      <div className="flex gap-6 items-center justify-center">
        <img src={url} alt="BrightStack Logo" className="aspect-square w-20 @md:w-32 @2xl:w-48 rounded-3xl shadow-md dark:shadow-xl" />
        <input ref={ref} type="file" accept="image/*" onChange={upload} className="hidden" />
        <Button
          onClick={() => {
            ref.current?.click()
          }}
        >
          Upload
        </Button>
      </div>

      <Accordion />
    </div>
  )
}
