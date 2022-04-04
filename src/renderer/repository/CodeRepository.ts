import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";
import {AuthRepository} from "renderer/repository/AuthRepository";
import {User} from "renderer/repository/UserRepository";

/**
 * "code/refresh" request
 */

const CODE_REFRESH_PATH = "code/refresh"

interface CodeRefreshRequest {
}

interface CodeRefreshResponse extends DroplyResponse {
    code: number
}

/**
 * "code/find" request
 */

const CODE_FIND_PATH = "code/find"

interface CodeFindRequest {
    code: number
}

interface CodeFindResponse {
    success: boolean
    user: User
}

export class CodeRepository {
    public static Instance = new CodeRepository();

    public async getCode(): Promise<number> {
        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<CodeRefreshRequest, CodeRefreshResponse>({
                path: CODE_REFRESH_PATH,
                request: {}
            })

        return response.code
    }

    public async findUser(code: number): Promise<User> {
        await AuthRepository.Instance.waitAuth()

        let response = await WebsocketHelper.Instance
            .request<CodeFindRequest, CodeFindResponse>({
                path: CODE_FIND_PATH,
                request: {code}
            })

        if (response.success) {
            return response.user
        }

        return null
    }
}
