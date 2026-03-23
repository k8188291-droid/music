export default function Spinner({ size = 32 }) {
  return (
    <div
      className="animate-spin rounded-full border-4 border-white/10 border-t-green-500"
      style={{ width: size, height: size }}
    />
  )
}
