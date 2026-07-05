export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="TrocaCopa"
      height={48}
      className={className}
      style={{ height: 48, width: 'auto' }}
    />
  )
}
