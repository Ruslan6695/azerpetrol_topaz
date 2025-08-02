import { Dimensions } from 'react-native'

const height = (h: number) => {
    const height = Dimensions.get('window').height * h
    return height
}
const width = (w: number) => {
    const width = Dimensions.get('window').width * w
    return width
}
export const SIZES = {
    WIDTH: (w: number) => {
        const width = Dimensions.get('window').width * w
        return width
    },
    HEIGHT: (h: number) => {
        const height = Dimensions.get('window').height * h
        return height
    },
    PX: width(0.0026),
}
