import { useRef } from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, {
    ICarouselInstance,
    Pagination,
} from 'react-native-reanimated-carousel'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { EColorThemes } from '../../common/config/enums/EColorThemes'
import { PromotionsAndBonusesItem } from '../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import { IShowPromotionsModalData } from '../../../features/ShowPromotionsModal/config/interfaces/IShowPromotionsModalData'
const width = Dimensions.get('window').width

interface IProps extends IShowPromotionsModalData {}
export const ImageCarousel = ({ promotions }: IProps) => {
    const ref = useRef<ICarouselInstance>(null)
    const progress = useSharedValue<number>(0)
    const colorTheme = ThemeStore.useTheme()
    const COLORS = ThemeStore.useCOLORS()
    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            /**
             * Calculate the difference between the current index and the target index
             * to ensure that the carousel scrolls to the nearest index
             */
            count: index - progress.value,
            animated: true,
        })
    }
    return (
        <>
            <Carousel
                autoPlayInterval={5000}
                autoPlay
                style={{ borderRadius: 25 * SIZES.PX }}
                ref={ref}
                width={SIZES.WIDTH(0.9)}
                height={160 * SIZES.PX}
                data={promotions}
                onProgressChange={progress}
                renderItem={({ item }) => (
                    <PromotionsAndBonusesItem {...item} />
                )}
            />

            <Pagination.Basic
                progress={progress}
                data={promotions}
                dotStyle={{
                    backgroundColor: 'black',
                    borderRadius: '50%',
                }}
                activeDotStyle={{
                    backgroundColor: COLORS.BRAND.Secondary,
                }}
                containerStyle={{ gap: 5 * SIZES.PX, marginTop: 10 * SIZES.PX }}
                onPress={onPressPagination}
            />
        </>
    )
}
 