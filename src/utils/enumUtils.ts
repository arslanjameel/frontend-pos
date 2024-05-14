export const enumKeys = (e: any): string[] => {
  return Object.keys(e).filter(v => isNaN(Number(e[v])))
}
