export const lightenColor = (
  hexColor: string,
  percent: number,
) => {
  // Remove the '#' symbol if it's present
  hexColor = hexColor.replace(/^#/, '')

  // Parse the hexadecimal color to RGB
  const r = parseInt(hexColor.slice(0, 2), 16)
  const g = parseInt(hexColor.slice(2, 4), 16)
  const b = parseInt(hexColor.slice(4, 6), 16)

  // Calculate the new RGB values based on the percentage
  const newR = Math.min(
    255,
    r + (255 - r) * (percent / 100),
  )
  const newG = Math.min(
    255,
    g + (255 - g) * (percent / 100),
  )
  const newB = Math.min(
    255,
    b + (255 - b) * (percent / 100),
  )

  // Convert the new RGB values back to hexadecimal
  const newHexColor = `#${Math.round(newR)
    .toString(16)
    .padStart(2, '0')}${Math.round(newG)
    .toString(16)
    .padStart(2, '0')}${Math.round(newB)
    .toString(16)
    .padStart(2, '0')}`

  return newHexColor
}
