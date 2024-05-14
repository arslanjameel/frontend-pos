const capitalize = (input: string) => {
  const words = input.split(/[\s_]+/)

  const capitalizedWords = words.map(word => {
    return (
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase()
    )
  })

  return capitalizedWords.join(' ')
}

export default capitalize
