import { memo } from 'react'
import { ITab } from '../config/interfaces/ITab'
import { StyleSheet, View } from 'react-native'
import { Tab } from './Tab'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { SIZES } from '../../common/config/constants/sizes'

type Props = {
    tabs: ITab[]
    selectedTab: ITab | undefined
    onChangeSelectedTab: (tab: ITab) => void
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

export const TabBar = memo(
    ({ tabs, styled, onChangeSelectedTab, selectedTab }: Props) => {
        const widthh = styled

        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                //@ts-ignore
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
                gap: 22 * SIZES.PX,
            },
        })
        return (
            <View style={styles.container}>
                {tabs.map((tab, key, arr) => (
                    <Tab
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
