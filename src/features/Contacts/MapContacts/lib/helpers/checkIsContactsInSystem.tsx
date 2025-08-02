import * as Contacts from 'expo-contacts'
import { mask } from 'react-native-mask-text'
import { contactsApi } from '../../api/contactsApi'
import { randomUUID } from 'expo-crypto'
import { IContactItem } from '../../../../../entities/ContactItem'
import {
    EPermissionsStatuses,
    setItemToAsyncStorage,
} from '../../../../../shared'
import { EAsyncStoreKeys } from '../../../../../shared/common/config/enums/EAsyncStoreKeys'

export const checkIsContactInSystem = async (status: EPermissionsStatuses) => {
    if (status === EPermissionsStatuses.SUCCESS) {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
            sort: Contacts.SortTypes.FirstName,
        })

        if (data?.length > 0) {
            const contacts: IContactItem[] = []
            data.forEach((item) => {
                if (item.phoneNumbers) {
                    if (item.phoneNumbers[0].number?.substring(0, 2) === '+7') {
                        contacts.push({
                            phone: mask(
                                String(
                                    item.phoneNumbers[0].number.substring(2)
                                ),
                                '89999999999'
                            ),
                            name:
                                item.name ||
                                item.firstName ||
                                item.lastName ||
                                item.middleName ||
                                item.maidenName ||
                                item.nickname ||
                                item.phoneticFirstName ||
                                item.phoneticLastName ||
                                item.phoneticMiddleName ||
                                item.name ||
                                ' ',
                            id: randomUUID(),
                        })
                    } else {
                        contacts.push({
                            phone: mask(
                                String(item.phoneNumbers[0].number),
                                '89999999999'
                            ),
                            name:
                                item.name ||
                                item.firstName ||
                                item.lastName ||
                                item.middleName ||
                                item.maidenName ||
                                item.nickname ||
                                item.phoneticFirstName ||
                                item.phoneticLastName ||
                                item.phoneticMiddleName ||
                                item.name ||
                                ' ',
                            id: randomUUID(),
                        })
                    }
                } else {
                    return null
                }
            })

            const contactsData = await contactsApi.checkIsContacts(contacts)
            await setItemToAsyncStorage({
                key: EAsyncStoreKeys.CONTACTS,
                value: JSON.stringify(contactsData.contacts),
            })
        } else {
        }
    } else {
        return status
    }
}
