'use client'

interface Props {
  onDelete: () => Promise<{ error?: string }>
}

// Client wrapper so the confirm() handler can live on the button — a server
// component cannot pass an onClick handler to the DOM.
export function DeleteProjectButton({ onDelete }: Props) {
  return (
    <form action={async () => { await onDelete() }}>
      <button
        type="submit"
        className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors"
        onClick={(e) => {
          if (!confirm('Delete this project?')) e.preventDefault()
        }}
      >
        Delete
      </button>
    </form>
  )
}
