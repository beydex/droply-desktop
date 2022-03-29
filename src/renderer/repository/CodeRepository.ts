import WebsocketHelper, {DroplyResponse} from "renderer/helpers/WebsocketHelper";
import {AuthRepository} from "renderer/repository/AuthRepository";

const CODE_REFRESH_PATH = "code/refresh"

interface CodeRefreshRequest {
}

interface CodeRefreshResponse extends DroplyResponse {
    code: number
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

        console.log(response)
        return response.code
    }
}
