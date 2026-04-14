import { cn } from '@/lib/utils'

export function WhatsAppText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <strong key={i}>{part.slice(1, -1)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

type WhatsAppMessageBubbleProps = {
  text: string
  timestamp?: string
  emptyPlaceholder?: string
  className?: string
  bubbleClassName?: string
}

export function WhatsAppMessageBubble({
  text,
  timestamp,
  emptyPlaceholder = 'Sem conteúdo.',
  className,
  bubbleClassName,
}: WhatsAppMessageBubbleProps) {
  const lines = (text ?? '').split('\n')
  const hasContent = lines.some((line) => line.length > 0)

  return (
    <div className={cn('rounded-xl bg-[#ECE5DD] p-4', className)}>
      <div
        className={cn(
          'relative max-w-xs rounded-lg rounded-tl-none bg-white px-4 py-3 shadow-sm',
          bubbleClassName,
        )}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">
          {hasContent ? (
            lines.map((line, i) => (
              <span key={i}>
                <WhatsAppText text={line} />
                {i < lines.length - 1 && <br />}
              </span>
            ))
          ) : (
            <span className="text-slate-400">{emptyPlaceholder}</span>
          )}
        </p>
        {timestamp ? (
          <p className="mt-1 text-right text-[10px] text-slate-400">
            {timestamp}
          </p>
        ) : null}
      </div>
    </div>
  )
}
