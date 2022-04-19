import {FullUser} from "renderer/repository/UserRepository";
import {AuthRepository} from "renderer/repository/AuthRepository";
import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";

/**
 * "contact/list" method
 */

const CONTACT_LIST_PATH = "contact/list"

interface ContactListRequest {
}

interface ContactListResponse extends DroplyResponse {
    entries: Contact[]
}

/**
 * "contact/delete" method
 */
const CONTACT_DELETE_PATH = "contact/delete"

interface ContactDeleteRequest {
    id: number
}

interface ContactDeleteResponse extends DroplyResponse {
}

export interface Contact {
    user: FullUser
    lastSuccessRequestDate: string
}

export class ContactsRepository {
    public static Instance = new ContactsRepository()

    public async listContacts(): Promise<Contact[]> {
        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<ContactListRequest, ContactListResponse>({
                path: CONTACT_LIST_PATH,
                request: {}
            })

        if (response.success) {
            return response.entries
        }

        return null
    }

    public async deleteContact(userId: number): Promise<boolean> {
        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<ContactDeleteRequest, ContactDeleteResponse>({
                path: CONTACT_DELETE_PATH,
                request: {
                    id: userId
                }
            })

        return response.success
    }
}
