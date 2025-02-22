type Fetch = (
  input: RequestInfo,
  init?: RequestInit & { noContentType?: boolean },
) => Promise<Response>

export class ProcessSEE {
  private dataStream?: ReadableStream<unknown>

  async connect(
    fetchFn: Fetch,
    input: RequestInfo,
    init?: RequestInit & { noContentType?: boolean },
  ) {
    const data = await fetchFn(input, init)

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
  }

  onMessage<T>(cb: (data: T) => void) {
    this.dataStream?.pipeTo(
      new WritableStream({
        write(data: string) {
          const parsedData = JSON.parse(data) as T
          console.log('Mensagem SSE recebida:', parsedData)
          cb(parsedData)
        },
      }),
    )
  }
}
