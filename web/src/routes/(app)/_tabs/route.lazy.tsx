import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn/ui/avatar'
import { Sheet, SheetTrigger } from '@/components/ui/shadcn/ui/sheet'
import SheetContent from '@/components/ui/sheet/SheetContent'
import { createLazyFileRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { tw } from 'bsdweb'
import { ArchiveRestore, FileEdit, House } from 'lucide-react'

export const Route = createLazyFileRoute('/(app)/_tabs')({
  component: Tabs,
})

function Tabs() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="border-b flex items-center h-[--header-bar-height] px-3 justify-between">
        <h1 className="text-4xl font-bold text-primary">BSDNative</h1>
        <Sheet>
          <SheetContent />
          <SheetTrigger>
            <Avatar className="size-6">
              <AvatarImage src="https://github.com/shadcn.png" alt="name" />
              <AvatarFallback>NAME</AvatarFallback>
            </Avatar>
          </SheetTrigger>
        </Sheet>
      </header>
      <main className="h-[calc(100dvh-var(--header-bar-height)-var(--tab-bar-height))] w-full">
        <Outlet />
      </main>
      <nav className="h-[--tab-bar-height] border-t flex">
        <Tab {...TabScheme.dashboard} />
        <Tab {...TabScheme.create} />
        <Tab {...TabScheme.house} />
      </nav>
    </div>
  )
}

const TabScheme = {
  dashboard: {
    path: '/',
    Icon: House,
  },
  create: {
    path: '/calculated',
    Icon: FileEdit,
  },
  house: {
    path: '/random',
    Icon: ArchiveRestore,
  },
}

function Tab<T extends (typeof TabScheme)[keyof typeof TabScheme]>({ Icon, path }: T) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <button className="w-full flex items-center justify-center pb-6" onClick={() => navigate({ to: path })}>
      <Icon size={24} className={tw('size-8', pathname !== path ? 'stroke-[1.4px]' : 'stroke-[2.5px]')} />
    </button>
  )
}
