export function roundNumber(number: number, rounding: number) {
    var b = number % rounding
    b && (number = number - b + rounding)
    return number
}
