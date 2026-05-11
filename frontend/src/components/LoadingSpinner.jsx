export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="spinner" />
      <p className="mt-3 text-text-secondary text-[13px]">Processing...</p>
    </div>
  )
}
