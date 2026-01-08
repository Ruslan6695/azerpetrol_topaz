import { memo } from 'react'
import { Image, StyleSheet } from 'react-native'
import { SIZES } from '../../../../shared'
import ProfileSvg from '../assets/profile.svg'
type Props = {
    size?: number
    img?: string
}

export const ProfileImg = memo(({ img, size }: Props) => {
    const styles = StyleSheet.create({
        img: {
            width: (size || 120) * SIZES.PX,
            height: (size || 120) * SIZES.PX,
            objectFit: 'contain',
            borderRadius: 500,
        },
    })
    if (img) {
        return <Image style={styles.img} source={{ uri: img }} />
    }
    return (
        <ProfileSvg
            width={(size || 120) * SIZES.PX}
            height={(size || 120) * SIZES.PX}
        />
    )
})
