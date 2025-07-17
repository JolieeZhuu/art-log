export function SiteHeader({ heading }: { heading: string } ) {
  return (
    <header className="flex h-(--header-height) shrink-0 gap-2 border-b ease-linear">
      <div className="flex w-full gap-1">
        <p className="text-base font-medium">{heading}</p>
      </div>
    </header>
  )
}