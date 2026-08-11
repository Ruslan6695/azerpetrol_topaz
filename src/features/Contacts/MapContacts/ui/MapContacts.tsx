import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ContactItem, IContactItem } from '../../../../entities/ContactItem'
import { ESCREENS, SIZES, SPACING, getContacts } from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { GlassInput } from '../../../../shared/GlassInput'
import { Icon } from '../../../../shared/Icons'

type Props = {
    onSelectLink: ESCREENS | undefined
}

const SEARCH_HEIGHT = 48

export const MapContacts = memo(({ onSelectLink }: Props) => {
    const router = useRouter()
    const [contacts, setContacts] = useState<IContactItem[]>([])
    const [filteredContacts, setFilteredContacts] = useState<IContactItem[]>([])
    const [query, setQuery] = useState('')

    const handleChangeQuery = useCallback(
        (text: string) => {
            setQuery(text)

            // Макет ищет и по имени, и по номеру: пользователь помнит
            // либо одно, либо другое.
            const search = text.toLowerCase()
            setFilteredContacts(
                contacts.filter(
                    (contact) =>
                        contact.name.toLowerCase().includes(search) ||
                        contact.phone.includes(text)
                )
            )
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
        [router, onSelectLink]
    )

    const fetchContacts = useCallback(async () => {
        const resp: IContactItem[] = await getContacts()

        setContacts(resp)
        setFilteredContacts(resp)
    }, [])

    const styles = StyleSheet.create({
        // Экран открыт с hideScroll, но контент всё равно лежит внутри
        // KeyboardAwareScrollView — flex: 1 там схлопнулся бы в ноль и
        // FlashList не получил бы высоты. Поэтому высота задаётся явно.
        wrapper: {
            height: SIZES.HEIGHT(0.8),
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
        list: {
            flex: 1,
        },
        listContent: {
            paddingBottom: SPACING.SECTION * SIZES.PX,
        },
        // FlashList не разносит элементы через gap контейнера —
        // зазор макета (10) даёт разделитель.
        separator: {
            height: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    useEffect(() => {
        fetchContacts()
    }, [])

    return (
        <View style={styles.wrapper}>
            <GlassInput
                height={SEARCH_HEIGHT}
                keepSpaces
                onChangeText={handleChangeQuery}
                value={query}
                placeholder="Поиск по имени или номеру"
                icon={<Icon name="person" size={18} opacity={0.5} />}
            />

            {filteredContacts.length === 0 ? (
                <CenteredState variant="empty" title="Контакты не найдены" />
            ) : (
                <FlashList
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    data={filteredContacts}
                    // id генерируется на клиенте до похода на get_contacts/,
                    // в ответе он не гарантирован — телефон как запасной ключ.
                    keyExtractor={(item) => String(item.id ?? item.phone)}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    renderItem={({ item }) => (
                        <ContactItem onPress={handlePressOnContact} {...item} />
                    )}
                />
            )}
        </View>
    )
})
