/**
 * Máscara para placa veicular (ABC-1234)
 */
export const maskPlate = (value: string): string => {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/^(.{3})(.{0,4})$/, (match, p1, p2) => {
      if (p2) return `${p1}-${p2}`
      return p1
    })
    .slice(0, 8)
}

/**
 * Remove máscara da placa
 */
export const unmaskPlate = (value: string): string => {
  return value.replace(/[^A-Z0-9]/g, '')
}

/**
 * Máscara para valor em reais (R$ 1.234,56)
 */
export const maskCurrency = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '')
  const numericAsInteger = parseInt(numericValue || '0', 10)
  const realString = (numericAsInteger / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  return realString
}

/**
 * Remove máscara de moeda e retorna valor numérico
 */
export const unmaskCurrency = (value: string): number => {
  const numericValue = value
    .replace('R$', '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  return parseFloat(numericValue) || 0
}
