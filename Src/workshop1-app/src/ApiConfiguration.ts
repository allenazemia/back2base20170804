import { provide } from './inversify.config';

export interface IApiConfiguration {
    readonly people: string;
}

@provide(ApiConfiguration)
export class ApiConfiguration implements IApiConfiguration {
    readonly people;

    constructor() {
        this.people = 'http://localhost:8080';
    }
}
