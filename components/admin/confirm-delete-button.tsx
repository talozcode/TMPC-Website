'use client'

interface Props {
  action: () => Promise<unknown>
  message: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

// Client wrapper so the confirm() handler can live on the button - a server
// component cannot pass an onClick handler to the DOM. The server action is
// passed in already bound (e.g. deleteCategory.bind(null, id)).
export function ConfirmDeleteButton({ action, message, children, className, disabled }: Props) {
  return (
    <form action={async () => { await action() }}>
      <button
        type="submit"
        disabled={disabled}
        className={className}
        onClick={(e) => {
          if (!confirm(message)) e.preventDefault()
        }}
      >
        {children}
      </button>
    </form>
  )
}
