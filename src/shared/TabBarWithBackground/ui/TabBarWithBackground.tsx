import { memo } from 'react'
import { ITabWithBackground } from '../config/interfaces/ITabWithBackground'
import { StyleSheet, View } from 'react-native'
import { TabWithBackground } from './TabWithBackground'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { SIZES } from '../../common/config/constants/sizes'

type Props = {
    tabs: ITabWithBackground[]
    selectedTab: ITabWithBackground | undefined
    onChangeSelectedTab: (tab: ITabWithBackground) => void
    styled?: {
        marginsPaddings?: IMarginsPaddings
        fz?: number
        width?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
        height?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
    }
}

export const TabBarWithBackground = memo(
    ({ tabs, styled, onChangeSelectedTab, selectedTab }: Props) => {
        const widthh = styled
            ? styled.width
                ? (styled.width.type === 'px' || !styled.width) &&
                  typeof styled.width.value === 'number'
                    ? styled.width.value * SIZES.PX
                    : styled.width.value
                : SIZES.WIDTH(0.85)
            : SIZES.WIDTH(0.85)
        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                //@ts-ignore
                width: widthh,
                marginTop: styled?.marginsPaddings?.mt
                    ? styled?.marginsPaddings?.mt * SIZES.PX
                    : 0,
                marginBottom: styled?.marginsPaddings?.mb
                    ? styled?.marginsPaddings?.mb * SIZES.PX
                    : 0,
                marginRight: styled?.marginsPaddings?.mr
                    ? styled?.marginsPaddings?.mr * SIZES.PX
                    : 0,
                marginLeft: styled?.marginsPaddings?.ml
                    ? styled?.marginsPaddings?.ml * SIZES.PX
                    : 0,
            },
        })
        return (
            <View style={styles.container}>
                {tabs.map((tab, key, arr) => (
                    <TabWithBackground
                        onPress={onChangeSelectedTab}
                        isSelected={selectedTab?.value === tab.value}
                        isFirst={key === 0}
                        isLast={key === arr.length - 1}
                        {...tab}
                        key={tab.value}
                    />
                ))}
            </View>
        )
    }
)
