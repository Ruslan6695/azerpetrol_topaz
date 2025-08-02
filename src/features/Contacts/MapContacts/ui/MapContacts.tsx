import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomInput, useInput } from '../../../../shared/CustomInput'
import { ContactItem, IContactItem } from '../../../../entities/ContactItem'
import { COLORS, ESCREENS, SIZES, getContacts } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'

type Props = {
    onSelectLink: ESCREENS | undefined
}

export const MapContacts = memo(({ onSelectLink }: Props) => {
    const router = useRouter()
    const [contacts, setContacts] = useState<IContactItem[]>([])

    const [filteredContacts, setFilteredContacts] = useState<IContactItem[]>([])

    const { inputValue, setInputValue } = useInput()

    const handleChangeInputValue = useCallback(
        (text: string) => {
            setInputValue(text)

            const filteredContacts = contacts?.filter((contact) => {
                return contact.name.toLowerCase().includes(text.toLowerCase())
            })
            setFilteredContacts(filteredContacts)
        },
        [contacts]
    )

    const handlePressOnContact = useCallback(
        ({ name, phone }: IContactItem) => {
            router.navigate({
                pathname: onSelectLink || ESCREENS.TRANSFER_BALANCE,
                params: { name, phone },
            })
        },
        []
    )

    const fetchContacts = useCallback(async () => {
        const resp: IContactItem[] = await getContacts()

        setContacts(resp)
        setFilteredContacts(resp)
    }, [])

    useEffect(() => {
        fetchContacts()
    }, [])

    return (
        <View style={styles.wrapper}>
            <CustomInput
                onChangeText={(text: string) => {
                    handleChangeInputValue(text)
                }}
                value={inputValue}
                placeholder="Введите имя"
                styled={{
                    width: { type: 'absolute', value: '100%' },
                    marginsPaddings: { mb: 10 },
                }}
            />

            <View style={styles.contactsWrapper}>
                {filteredContacts?.length === 0 ? (
                    <CustomText
                        fz={18}
                        secondary
                        marginsPaddings={{ mt: 100 }}
                        textAlign="center"
                    >
                        КОНТАКТЫ НЕ НАЙДЕНЫ
                    </CustomText>
                ) : (
                    <FlashList
                        contentContainerStyle={{
                            paddingHorizontal: 10,
                        }}
                        style={styles.contacts}
                        showsVerticalScrollIndicator={false}
                        data={filteredContacts}
                        renderItem={({ item }) => (
                            <ContactItem
                                onPress={handlePressOnContact}
                                {...item}
                                key={Math.random()}
                            />
                        )}
                    />
                )}
            </View>

            <View></View>
        </View>
    )
})
const styles = StyleSheet.create({
    wrapper: {
        height: SIZES.HEIGHT(0.8),
    },
    contacts: {
        gap: 10 * SIZES.PX,
    },
    contactsWrapper: {
        flex: 1,
        backgroundColor: COLORS.GRAY_3,
        borderRadius: SIZES.PX * 11,
        paddingVertical: SIZES.PX * 5,
    },
})
