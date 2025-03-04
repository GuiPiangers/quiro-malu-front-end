export class ProcessSEE {
  private dataStream?: ReadableStream<unknown>
  private abortController: AbortController | null = null

  async connect(url: string, init: RequestInit) {
    try {
      if (this.abortController) return
      this.abortController = new AbortController()
      const data = await fetch(url, {
        signal: this.abortController.signal,
        ...init,
      })

      if (!data.ok || !data.body) {
        console.error('Falha ao conectar ao SSE')
        return
      }

      const stream = data.body
        ?.pipeThrough(new TextDecoderStream()) // Converte os dados binários para string
        .pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              chunk.split('\n').forEach((line) => {
                if (line.startsWith('data: ')) {
                  controller.enqueue(line.replace('data: ', '').trim())
                }
              })
            },
          }),
        )

      this.dataStream = stream
    } catch (error) {
      console.log(error)
    }
  }

  onMessage<T>(cb: (data: T) => void) {
    this.dataStream?.pipeTo(
      new WritableStream({
        write(data: string) {
          const parsedData = JSON.parse(data) as T
          cb(parsedData)
        },
      }),
      { signal: this.abortController?.signal },
    )
  }

  close() {
    this.abortController?.abort('service closed')
    this.abortController = null
  }
}
