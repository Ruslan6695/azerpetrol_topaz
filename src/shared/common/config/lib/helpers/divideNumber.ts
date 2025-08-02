export const divideNumber = (number: number) => {
    const n = String(number)
    return (n + '')
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1 ')
        .split('')
        .reverse()
        .join('')
        .replace(/^ /, '')
}
