import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomSelectBottomSheet, ISelectOption } from '../../CustomSelect'
import { GlassCard } from '../../GlassCard'
import { Typography } from '../../Typography'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { useModal } from '../../common/config/lib/hooks/useModal'
import { ThemeStore } from '../../common/model/themeStore'

type Props = {
    placeholder: string
    options: ISelectOption[]
    selectedOption: ISelectOption | null
    onChangeOption: (option: ISelectOption | null) => void
    disabled?: boolean
}

// Поле выбора в стиле «21 Век»: стеклянная строка, по нажатию открывается
// колесо-пикер из CustomSelect. Нужно там, где вариантов много и списком
// они занимают весь экран (номера колонок).
export const GlassSelect = memo(
    ({
        placeholder,
        options,
        selectedOption,
        onChangeOption,
        disabled,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

        const styles = StyleSheet.create({
            row: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: SPACING.MD * SIZES.PX,
                opacity: disabled ? 0.5 : 1,
            },
        })

        return (
            <>
                <GlassCard
                    variant="glass2"
                    radius={RADII.ROW}
                    paddingVertical={SPACING.XL}
                    paddingHorizontal={18}
                    pressScale={PRESS_SCALE.ROW}
                    onPress={disabled ? undefined : handleOpenModal}
                >
                    <View style={styles.row}>
                        <Typography
                            type="rowTitle"
                            color={selectedOption ? 'primary' : 'secondary'}
                        >
                            {selectedOption
                                ? selectedOption.label
                                : placeholder}
                        </Typography>
                        <Typography
                            type="num16"
                            customColor={COLORS.TEXT.Secondary}
                        >
                            ⌄
                        </Typography>
                    </View>
                </GlassCard>

                <CustomSelectBottomSheet
                    isOpened={isShowModal}
                    handleClose={handleCloseModal}
                    title={placeholder}
                    options={options}
                    selectedOption={selectedOption}
                    onChangeOption={onChangeOption}
                />
            </>
        )
    }
)
