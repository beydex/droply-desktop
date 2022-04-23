import {FullUser} from "renderer/repository/UserRepository";
import {AuthRepository} from "renderer/repository/AuthRepository";
import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";
import {EventEmitter} from "events";

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
    entries: Contact[]
}

export interface Contact {
    user: FullUser
    lastSuccessRequestDate: string
}

export enum ContactRepositoryEvent {
    UPDATE = "update"
}

export class ContactsRepository extends EventEmitter {
    public static Instance = new ContactsRepository()

    private contacts: Contact[]

    public async listContacts(): Promise<Contact[]> {
        if (this.contacts != null) {
            return this.contacts
        }

        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<ContactListRequest, ContactListResponse>({
                path: CONTACT_LIST_PATH,
                request: {}
            })

        if (response.success) {
            this.updateContacts(response.entries)
        }

        return this.contacts
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

        if (response.success) {
            this.updateContacts(response.entries)
        }

        return response.success
    }

    private updateContacts(contacts: Contact[]) {
        this.contacts = contacts
        this.emit(ContactRepositoryEvent.UPDATE)
    }
}
