import axios from 'axios'
import { DOMEN, getToken } from '../../../../shared'
import { IContactItem } from '../../../../entities/ContactItem'

export const contactsApi = {
    checkIsContacts: async (contacts: IContactItem[] | undefined) => {
        const token = await getToken()
        const resp = await axios.request<{ contacts: IContactItem[] }>({
            data: { contacts, token },
            method: 'POST',
            url: `${DOMEN}get_contacts/`,
            headers: { 'Content-Type': 'application/json' },
        })
        return resp.data
    },
}
