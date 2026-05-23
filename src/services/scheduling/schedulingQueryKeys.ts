export const schedulesQtdQueryKey = {
  all: () => ['schedulesQtd'] as const,
  month: (userId: string, month: number, year: number) =>
    ['schedulesQtd', userId, month, year] as const,
}
