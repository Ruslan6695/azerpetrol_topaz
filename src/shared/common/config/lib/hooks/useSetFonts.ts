import { useFonts } from 'expo-font'

export const useSetFonts = () => {
    const [fontsIsLoaded] = useFonts({
        'Manrope-Medium': require('../../../../../../assets/fonts/Manrope-Medium.ttf'),
        'Manrope-SemiBold': require('../../../../../../assets/fonts/Manrope-SemiBold.ttf'),
        'Manrope-Bold': require('../../../../../../assets/fonts/Manrope-Bold.ttf'),
        'Manrope-ExtraBold': require('../../../../../../assets/fonts/Manrope-ExtraBold.ttf'),
    })
    return fontsIsLoaded
}
