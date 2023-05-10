import { ElementType } from 'react';
import { LoaderFunction, LoaderFunctionArgs, Params } from 'react-router-dom';

import { Dispatch, dispatch } from '../store';
import { Descriptor } from '../useTranslation';

type Dispatcher = (
  dispatch: Dispatch,
  args: LoaderFunctionArgs,
) => ReturnType<LoaderFunction>;

export const dispatchable =
  (dispatcher: Dispatcher): LoaderFunction =>
  (args) =>
    dispatcher(dispatch, args);

export type DataHandler<D = unknown> = (
  params: Params,
  data: D,
) => string | Descriptor | undefined;

export type StaticHandler = (params: Params) => string | Descriptor | undefined;

export const isDataHandler = <D,>(
  handler: unknown,
): handler is DataHandler<D> =>
  typeof handler === 'function' && handler.length === 2;

export const isStaticHandler = (handler: unknown): handler is StaticHandler =>
  typeof handler === 'function' && handler.length <= 1;

interface LoaderAndHandler<D> {
  loader?: LoaderFunction;
  handle?: DataHandler<D> | StaticHandler;
}

type HybridComponent<T extends ElementType, D> = T & LoaderAndHandler<D>;

export const loads = <T extends ElementType, D>(
  component: T,
  args: LoaderAndHandler<D>,
): HybridComponent<T, D> => Object.assign(component, args);
