import { observable, action } from 'mobx';
import { provide } from '../inversify.config';
import {ApiConfiguration} from '../ApiConfiguration';

export interface IGuidResult {
    id: string;
}

@provide(HttpClient)
export class HttpClient {
    @observable isBusy: boolean = false;
    baseUrl: string = '';

    private static logResponse(method: string, route: string, response: Response): void {
        if (response.status === 422) {
            console.warn(`[${method}] ${response.status} ${route}`);
        } else if (response.status >= 400 && response.status !== 422) {
            console.error(`[${method}] ${response.status} ${route}`);
        } else if (response.status >= 500 && response.status !== 500) {
            console.error(`[${method}] ${response.status} ${route}`);
        }
    }

    private static processResponse<TResult>(response: Response): Promise<TResult | string> {
        let contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return <Promise<TResult>>response.json();
        } else {
            return response.text();
        }
    }

    constructor(apiConfig: ApiConfiguration) {
        this.baseUrl = apiConfig.people;
    }

    setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    @action
    setBusy(value: boolean) {
        return this.isBusy = value;
    }

    get<TResult>(route: string): Promise<TResult> {
        let headers = new Headers();
        this.appendCommonHeaders(headers);

        let dataObject = {
            method: 'GET',
            headers: headers
        };

        const url = `${this.baseUrl}${route}`;

        this.setBusy(true);
        return fetch(url, dataObject)
            .then((response: Response): Promise<any> => {
                HttpClient.logResponse(dataObject.method, route, response);

                return HttpClient.processResponse(response);
            })
            .catch((err) => {
                throw err;
            });
    }

    put<TResult>(route: string): Promise<TResult>;
    put<TData, TResult>(route: string, data: TData): Promise<TResult>;
    put<TData = any, TResult = any>(route: string, data?: TData): Promise<TResult> {
        let headers = new Headers();
        this.appendCommonHeaders(headers);

        let dataObject: {
            method: string,
            body?: string,
            headers: any
        } = {
            method: 'PUT',
            headers: headers
        };

        if (data) {
            dataObject.body = JSON.stringify(data || '');
        }

        const url = `${this.baseUrl}${route}`;

        this.setBusy(true);
        return fetch(url, dataObject)
            .then((response: Response): Promise<any> => {
                HttpClient.logResponse(dataObject.method, route, response);

                return HttpClient.processResponse(response);
            })
            .catch((err) => {
                throw err;
            });
    }

    post<TData, TResult>(route: string, data: TData): Promise<TResult> {
        let headers = new Headers();
        this.appendCommonHeaders(headers);

        let dataObject = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers
        };

        const url = `${this.baseUrl}${route}`;

        this.setBusy(true);
        return fetch(url, dataObject)
            .then((response: Response): Promise<any> => {

                return HttpClient.processResponse(response);
            })
            .catch((err) => {
                console.error('error occurred');
            });
    }

    delete(route: string): Promise<Response> {
        let headers = new Headers();
        this.appendCommonHeaders(headers);

        let dataObject = {
            method: 'DELETE',
            headers: headers
        };

        const url = `${this.baseUrl}${route}`;

        this.setBusy(true);
        return fetch(url, dataObject)
            .then((response: Response): Promise<any> => {
                HttpClient.logResponse(dataObject.method, route, response);

                return HttpClient.processResponse(response);
            })
            .catch((err) => {
                throw err;
            });
    }

    private appendCommonHeaders(headers: Headers, isPatch = false): Headers {
        headers.append('Content-Type', (isPatch) ? 'application/json-patch+json' : 'application/json');
        return headers;
    }
}
