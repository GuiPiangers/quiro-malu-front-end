export default function Patient({ params }: { params: { id: string } }) {
  const path = params.id
  return (
    <div>
      <span>{path}</span>
    </div>
  )
}
