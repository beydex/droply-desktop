import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";
import {AuthRepository} from "renderer/repository/AuthRepository";

/**
 * "profile" request
 */
const PROFILE_PATH = "profile"

interface ProfileRequest {
}

interface ProfileResponse extends DroplyResponse {
    name: string
    email: string
    avatarUrl: string
}

export class User {
    name: string
    email: string
    avatar: string
}

export class UserRepository {
    public static Instance = new UserRepository()

    private user?: User = null

    public async getUser(): Promise<User> {
        if (this.user == null) {
            await this.fetchUser()
        }

        return this.user;
    }

    private async fetchUser(): Promise<void> {
        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<ProfileRequest, ProfileResponse>({
                path: "profile",
                request: {}
            })

        this.user = {
            name: response.name,
            email: response.email,
            avatar: response.avatarUrl,
        }
    }
}
