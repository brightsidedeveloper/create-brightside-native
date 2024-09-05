import { Button } from '@/components/ui/shadcn/ui/button'
import { Suspense, useCallback, useState } from 'react'
import { BrightBaseEdge, tw, wetToast } from 'bsdweb'
import VirtualizedInfiniteMap from '@/components/BrightBaseQuery/VirtualizedInfiniteMap'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/shadcn/ui/card'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/shadcn/ui/scroll-area'
import { Skeleton } from '@/components/ui/shadcn/ui/skeleton'
import useCreateInfiniteQuery from '@/hooks/BrightBaseQuery/useCreateInfiniteQuery'
import useSuspenseVirtualizedInfiniteMap from '@/hooks/BrightBaseQuery/useSuspenseVirtualizerInfiniteQuery'
import FakeTables from '@/api/FakeTables'
import { Drawer, DrawerTrigger } from '@/components/ui/shadcn/ui/drawer'
import { DrawerContent } from '@/components/ui/drawer/DrawerContent'

/**
 * Demo of a full stack application using BrightStack with a lot of features and components.
 * Delete this file and create your own to get started.
 */
export default function Example() {
  return (
    <Suspense
      fallback={
        <ScrollArea className="p-4">
          {[...Array(5)].map((_, i) => (
            <Card className={tw('mb-4', i === 0 && 'mt-4')}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-[16px] w-24 rounded-full mb-1" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-[12px] w-72 rounded-full" />
                  <div className="h-[2px] w-full" />
                  <Skeleton className="h-[12px] w-32 rounded-full mb-3" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[16px] w-32 rounded-full" />
              </CardContent>
              <CardFooter className="flex justify-between opacity-20">
                <Skeleton className="w-20 h-10 " />
                <Skeleton className="w-20 h-10" />
              </CardFooter>
            </Card>
          ))}
        </ScrollArea>
      }
    >
      <VirtualizeInfiniteScroll />
    </Suspense>
  )
}

function VirtualizeInfiniteScroll() {
  const query = useCreateInfiniteQuery(FakeTables.todos, 20)
  const props = useSuspenseVirtualizedInfiniteMap(query, { estimateSize: (i) => (i === 0 ? 544 : i === 1 ? 247 : 231) })
  return (
    <VirtualizedInfiniteMap
      {...props}
      className="w-full h-[calc(100dvh-var(--header-bar-height)-var(--tab-bar-height))] px-4 animate-in"
      loadingComponent={
        <div className="flex-1 w-full h-[147px] flex items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      }
    >
      {(item, i) => (
        <Card className={tw('mb-4', i === 0 && 'mt-4')}>
          <EdgeFunction {...item} />
        </Card>
      )}
    </VirtualizedInfiniteMap>
  )
}

type Functions = {
  ai: { message: string }
}

const edge = new BrightBaseEdge<Functions>()

function EdgeFunction({ label }: { label: string }) {
  const [aiRes, setAiRes] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const go = useCallback(
    () =>
      edge
        .first(() => setLoading(true))
        .invoke('ai', { message: label })
        .then(setAiRes)
        .catch(() => wetToast("This edge function doesn't exist, check out bsdserv on npm for blessing. To ez 🤣", { icon: '❌' }))
        .finally(() => setLoading(false)),
    [label]
  )

  return (
    <>
      <CardHeader>
        <CardTitle>BrightSide</CardTitle>
        <CardDescription>
          Themed and virtualized scroll with infinite suspense query from generated supabase schemas in seconds.
        </CardDescription>
      </CardHeader>
      <CardContent>{aiRes ?? label}</CardContent>
      <CardFooter className="flex justify-between">
        <Drawer>
          <DrawerTrigger>
            <Button variant="outline">Drawer</Button>
          </DrawerTrigger>
          <DrawerContent />
        </Drawer>
        <Button onClick={go} disabled={loading}>
          {loading ? <Loader2 className="size-5 animate-spin mx-5" /> : 'Invoke AI'}
        </Button>
      </CardFooter>
    </>
  )
}
