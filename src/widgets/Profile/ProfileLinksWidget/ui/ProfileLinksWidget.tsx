import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { ExitFromProfile } from '../../../../features/Profile/ExitFromProfile'
import { MapProfileLinkItems } from '../../../../features/Profile/MapProfileLinkItems'
import { SIZES, SPACING } from '../../../../shared'
import { ListGroup } from '../../../../shared/ListRow'

export const ProfileLinksWidget = memo(() => {
    const styles = StyleSheet.create({
        container: {
            gap: SPACING.MD * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <ListGroup>
                <MapProfileLinkItems />
            </ListGroup>

            <ExitFromProfile />
        </View>
    )
})
