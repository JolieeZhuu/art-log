import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function SiteHeader({ heading }: { heading: string } ) {
  return (
    <header className="flex h-(--header-height) shrink-0 gap-2 border-b ease-linear">
      <div className="flex w-full gap-1">
        <p className="text-base font-medium">{heading}</p>
      </div>
    </header>
  )
}

/*
<Breadcrumb>
    <BreadcrumbList>
    <BreadcrumbItem>
        <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
        </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
        <BreadcrumbLink asChild>
            <Link href="/components">Components</Link>
        </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
    </BreadcrumbList>
</Breadcrumb>
*/