export default function Spinner({ size = 32 }) {
  return (
    <div
      className="animate-spin rounded-full border-2"
      style={{
        width: size,
        height: size,
        borderColor: 'var(--border)',
        borderTopColor: 'var(--accent)',
      }}
    />
  )
}
