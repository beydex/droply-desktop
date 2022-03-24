import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";

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
    avatarUrl?: string
}

export class UserRepository {
    public static Instance = new UserRepository()
    private user?: User

    public async getUser(): Promise<User> {
        if (this.user == null) {
            await this.getProfile();
        }

        return this.user;
    }

    private async getProfile(): Promise<boolean> {
        let response = await WebsocketHelper.Instance
            .request<ProfileRequest, ProfileResponse>({
                path: "profile",
                request: {}
            })

        console.log("GOT RESPONSE", response)

        this.user = {
            name: response.name,
            email: response.email,
            avatarUrl: response.avatarUrl,
        }

        return response.success
    }
}
