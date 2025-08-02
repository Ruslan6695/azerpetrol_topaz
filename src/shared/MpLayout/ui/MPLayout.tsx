import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
type Props = {
    children: React.ReactNode
}
interface IProps extends ViewProps {
    ml?: number
    mr?: number
    mt?: number
    mb?: number
    mh?: number
    mv?: number
    pl?: number
    pr?: number
    pt?: number
    pb?: number
    ph?: number
    pv?: number
    children: any
}

export const MPLayout = (props: IProps) => {
    const px = SIZES.PX

    const styles = StyleSheet.create({
        view: {
            //@ts-ignore
            ...props.style,
            marginLeft: px * (props.ml ? props.ml : 0),
            marginRight: px * (props.mr ? props.mr : 0),
            marginBottom: px * (props.mb ? props.mb : 0),
            marginTop: px * (props.mt ? props.mt : 0),
            marginHorizontal: px * (props.mh ? props.mh : 0),
            marginVertical: px * (props.mv ? props.mv : 0),
            paddingLeft: px * (props.pl ? props.pl : 0),
            paddingBottom: px * (props.pb ? props.pb : 0),
            paddingTop: px * (props.pt ? props.pt : 0),
            paddingRight: px * (props.pr ? props.pr : 0),
            paddingHorizontal: px * (props.ph ? props.ph : 0),
            paddingVertical: px * (props.pv ? props.pv : 0),
        },
    })
    return <View style={styles.view}>{props.children}</View>
}
