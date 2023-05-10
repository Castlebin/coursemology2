import { ComponentType, Suspense } from 'react';
import { Await, defer, useAsyncValue, useLoaderData } from 'react-router-dom';

import { DataHandler } from './loaders';

export interface DeferredLoaderData<T> extends Record<string, unknown> {
  data: Promise<T>;
}

export type DeferredHandler<D = unknown> = DataHandler<
  DeferredLoaderData<D> | D
>;

const createDeferredData = <T,>(data: Promise<T>): DeferredLoaderData<T> => ({
  data,
});

export const extractDeferredData = <T,>(
  deferredData: DeferredLoaderData<T>,
): Promise<T> => deferredData.data;

const deferred = <P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> => {
  const DeferredComponent = (props: P): JSX.Element => {
    const loaderData = useLoaderData() as DeferredLoaderData<unknown>;
    const data = extractDeferredData(loaderData);

    return (
      <Suspense fallback={<div>Loading yh mas</div>}>
        <Await errorElement={<div>Failed to load</div>} resolve={data}>
          <Component {...props} />
        </Await>
      </Suspense>
    );
  };

  DeferredComponent.displayName = `Deferred(${
    Component.displayName ?? (Component.name || 'Component')
  })`;

  return DeferredComponent;
};

const isRecord = <K extends string | number | symbol, V>(
  value: unknown,
): value is Record<K, V> => typeof value === 'object' && value !== null;

export const isPromise = <T,>(value: unknown): value is Promise<T> =>
  isRecord(value) && 'then' in value && typeof value.then === 'function';

export const isDeferredData = <T,>(
  data: unknown,
): data is DeferredLoaderData<T> =>
  isRecord(data) && 'data' in data && isPromise(data.data);

export const createDeferredHandler =
  <T,>(
    handler: DataHandler<T>,
    fallback?: ReturnType<DataHandler<T>>,
  ): DeferredHandler<T> =>
  (params, data) => {
    if (isDeferredData(data)) return fallback;

    return handler(params, data);
  };

export const deferrable = <T,>(data: Promise<T>): ReturnType<typeof defer> =>
  defer(createDeferredData(data));

export const useDeferredLoaderData = <T,>(): T => useAsyncValue() as T;

export default deferred;
