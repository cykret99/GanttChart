// @ts-check
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

/**
 * Restによる通信用
 *
 * @export
 * @class RestAPI
 */
export class RestAPI {
    private axios: AxiosInstance;

    constructor(argAxios: AxiosInstance) {
        this.axios = argAxios;
    }

    /**
     * axiosのエラーなのかチェック
     * @param error - エラーオブジェクト
     * @returns axiosエラーか
     */
    static isAxiosError(error: any): error is AxiosError {
        return !!error.isAxiosError;
    }

    /**
     * GETリクエスト用
     *
     * @template T データ型
     * @template U Param型
     * @template H ヘッダー型
     * @param {(response: AxiosResponse<T, H>) => void} callback レスポンスを受けるメソッド
     * @param {string} url リクエスト先URL
     * @param {U} [params] ヘッダー
     * @param {AxiosRequestConfig} [options]
     * @return {*}  {Promise<AxiosResponse<T, H>>}
     * @memberof RestAPI
     */
    get<T = any, U = any, H = any>(
        callback: (response: AxiosResponse<T, H>) => void,
        url: string,
        params?: U,
        options?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T, H>> {
        return this.request<T, H>(callback, { method: 'GET', url, params, ...options, });
    }

    /**
     *　POSTリクエスト用
    *
    * @template T データ型
    * @template U Body型
    * @template H ヘッダー型
    * @param {(response: AxiosResponse<T, H>) => void} callback レスポンスを受けるメソッド
    * @param {string} url リクエスト先URL
    * @param {U} [data] Body格納用
    * @param {AxiosRequestConfig} [options] ヘッダー格納用
    * @return {*}  {Promise<AxiosResponse<T, any>>}
    * @memberof RestAPI
    */
    post<T = any, U = any, H = any>(
        callback: (response: AxiosResponse<T, H>) => void,
        url: string,
        data?: U,
        options?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T, H>> {
        return this.request<T, H>(callback, { method: 'POST', url, data, ...options, });
    }

    /**
     * PUTリクエスト用
     *
     * @template T データ型
     * @template U Body型
     * @template H ヘッダー型
     * @param {(response: AxiosResponse<T, H>) => void} callback レスポンスを受けるメソッド
     * @param {string} url リクエスト先URL
     * @param {U} [data] Body
     * @param {AxiosRequestConfig} [options] ヘッダー
     * @return {*}  {Promise<AxiosResponse<T, H>>}
     * @memberof RestAPI
     */
    put<T = any, U = any, H = any>(
        callback: (response: AxiosResponse<T, H>) => void,
        url: string,
        data?: U,
        options?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T, H>> {
        return this.request<T, H>(callback, { method: 'PUT', url, data, ...options, });
    }

    /**
     * deleteリクエスト用
     *
     * @template T データ型
     * @template U Param型
     * @template H ヘッダー型
     * @param {(response: AxiosResponse<T, H>) => void} callback レスポンスを受けるメソッド
     * @param {string} url リクエスト先のURL
     * @param {U} [data] リクエストするデータの内容
     * @param {AxiosRequestConfig} [options]
     * @return {*}  {Promise<AxiosResponse<T, any>>}
     * @memberof RestAPI
     */
    delete<T = any, U = any, H = any>(
        callback: (response: AxiosResponse<T, H>) => void,
        url: string,
        data?: U,
        options?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T, H>> {
        return this.request<T, H>(callback, { method: 'DELETE', url, data, ...options, });
    }

    async request<T = any, H = any>(
        callback: (response: AxiosResponse<T, H>) => void,
        options: AxiosRequestConfig,
    ): Promise<AxiosResponse<T, H>> {
        // 末尾が "/" の場合は末尾を削除
        if (typeof options.url !== 'undefined' && options.url.endsWith('/'))
            options.url = options.url.slice(0, -1)

        const localOptions: AxiosRequestConfig = { ...options };
        return await this.axios.request<T>(localOptions)
            .then((response) => {
                callback(response);
                return response;
            })
            .catch((error) => {

                if (RestAPI.isAxiosError(error) && typeof error.response !== 'undefined') {
                    console.error(error.response);
                    callback(error.response as AxiosResponse<T, H>);
                    return error.response;
                }

                console.error(error);
                callback(error);
                return error;
            }) as AxiosResponse<T, H>;

    }
}

export namespace RestAPI {
    let axiosInstance = axios.create();
    export let client = new RestAPI(axiosInstance);
}

export default RestAPI;
