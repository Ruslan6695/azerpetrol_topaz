import { memo, useCallback, useRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, {
    ICarouselInstance,
    Pagination,
} from 'react-native-reanimated-carousel'
import { PromotionsAndBonusesItem } from '../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import { IShowPromotionsModalData } from '../../../features/ShowPromotionsModal/config/interfaces/IShowPromotionsModalData'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { ThemeStore } from '../../common/model/themeStore'

interface IProps extends IShowPromotionsModalData {
    /** Ширина слайда. По умолчанию 90% экрана */
    width?: number
}

// Карусель требует фиксированную высоту слайда — берём высоту карточки акции
// с картинкой (PromotionImageCard), под неё карточка и нарисована.
const SLIDE_HEIGHT = 150
const DOT_SIZE = 6

export const ImageCarousel = memo(
    ({ promotions, width: slideWidth }: IProps) => {
        const ref = useRef<ICarouselInstance>(null)
        const progress = useSharedValue<number>(0)
        const COLORS = ThemeStore.useCOLORS()

        // Одна акция — это не слайдер: ни автопрокрутка, ни точки не нужны.
        const isSlider = promotions.length > 1

        const handlePressPagination = useCallback((index: number) => {
            ref.current?.scrollTo({
                /**
                 * Calculate the difference between the current index and the target index
                 * to ensure that the carousel scrolls to the nearest index
                 */
                count: index - progress.value,
                animated: true,
            })
        }, [])

        return (
            <>
                <Carousel
                    autoPlayInterval={5000}
                    autoPlay={isSlider}
                    enabled={isSlider}
                    style={{ borderRadius: RADII.CARD * SIZES.PX }}
                    ref={ref}
                    width={slideWidth ?? SIZES.WIDTH(0.9)}
                    height={SLIDE_HEIGHT * SIZES.PX}
                    data={promotions}
                    onProgressChange={progress}
                    renderItem={({ item }) => (
                        <PromotionsAndBonusesItem {...item} />
                    )}
                />

                {isSlider && (
                    <Pagination.Basic
                        progress={progress}
                        data={promotions}
                        dotStyle={{
                            backgroundColor: COLORS.GLASS.Border,
                            width: DOT_SIZE * SIZES.PX,
                            height: DOT_SIZE * SIZES.PX,
                            borderRadius: RADII.PILL,
                        }}
                        activeDotStyle={{
                            backgroundColor: COLORS.ACCENT.Lime,
                        }}
                        containerStyle={{
                            gap: SPACING.SM * SIZES.PX,
                            marginTop: SPACING.MD * SIZES.PX,
                        }}
                        onPress={handlePressPagination}
                    />
                )}
            </>
        )
    }
)
