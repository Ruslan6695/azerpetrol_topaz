import { useFonts } from 'expo-font'

export const useSetFonts = () => {
    const [fontsIsLoaded] = useFonts({
        'Manrope-Medium': require('../../../../../../assets/fonts/Manrope-Medium.ttf'),
        'Manrope-SemiBold': require('../../../../../../assets/fonts/Manrope-SemiBold.ttf'),
    })
    return fontsIsLoaded
}
