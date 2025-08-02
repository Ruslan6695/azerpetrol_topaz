import { memo } from 'react'
import { SIZES } from '../../common/config/constants/sizes'
import LocationWhiteSvg from '../assets/locationWhite.svg'
import LocationSvg from '../assets/location.svg'
type Props = {
    white?: boolean
    size?: number
}

export const LocationIcon = memo(({ white, size }: Props) => {
    if (white) {
        return (
            <LocationWhiteSvg
                width={size || 20 * SIZES.PX}
                height={size || 20 * SIZES.PX}
            />
        )
    }
    return (
        <LocationSvg
            width={size || 20 * SIZES.PX}
            height={size || 20 * SIZES.PX}
        />
    )
})
