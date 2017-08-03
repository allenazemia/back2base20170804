import 'reflect-metadata';
import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { makeProvideDecorator , makeFluentProvideDecorator } from 'inversify-binding-decorators';

export const container = new Container();
export let provide = makeProvideDecorator(container);
export let fluentProvide = makeFluentProvideDecorator(container);

export let provideSingleton = function(identifier) {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
};

export const lazyInject = getDecorators(container).lazyInject;
