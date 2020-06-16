
export const shortenDescription = (text) => {
  if (text && text.length > 100) {
    text = text.substring(0, 97) + '...'
  }
  return text
}
