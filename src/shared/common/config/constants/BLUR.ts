import { Platform } from 'react-native'

// Настоящий backdrop-blur на Android требует экспериментального dimezisBlurView,
// который перерисовывает иерархию каждый кадр — под скроллом это просадка FPS.
// Поэтому блюр только на iOS, а на Android стеклянные поверхности отдают
// непрозрачные COLORS.GLASS.Solid* — цвет стекла, предкомпозированный на фон.
export const CAN_BLUR = Platform.OS === 'ios'

export const BLUR_INTENSITY = 20
