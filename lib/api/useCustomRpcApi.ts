import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type {
  StakeValidatorInfo,
  StakeValidatorInfoParams,
  ValidatorInfo,
  ValidatorInfoParams,
} from 'types/api/customData/rpc';

import chain from 'configs/app/chain';
import useFetch from 'lib/hooks/useFetch';

import type { ResourceError } from './resources';

export type RpcName = 'staking_validatorInfo' | 'mining_getProviderInfo';

type RpcQueryParams<R extends RpcName> =
  R extends 'staking_validatorInfo' ? StakeValidatorInfoParams :
    R extends 'mining_getProviderInfo' ? ValidatorInfoParams :
      never;

type RpcResponseItem<R extends RpcName> =
  R extends 'staking_validatorInfo' ? StakeValidatorInfo :
    R extends 'mining_getProviderInfo' ? ValidatorInfo :
      never;

interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

interface JsonRpcResponse<T> {
  jsonrpc: string;
  id: number | string | null;
  result?: T;
  error?: JsonRpcError;
}

interface JsonRpcRequest<R extends RpcName> {
  jsonrpc: '2.0';
  id: number;
  method: R;
  params?: RpcQueryParams<R>;
}

function normalizeToArray<T>(value: T | Array<T> | null | undefined): Array<T> {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [ value ];
}

export interface Params<R extends RpcName, E = unknown, D = Array<RpcResponseItem<R>>> {
  queryParams?: RpcQueryParams<R>;
  queryOptions?: Partial<Omit<UseQueryOptions<Array<RpcResponseItem<R>>, ResourceError<E>, D>, 'queryFn'>>;
  logError?: boolean;
  rpcUrl?: string;
}

export interface GetResourceKeyParams<R extends RpcName> extends Pick<Params<R>, 'queryParams' | 'rpcUrl'> {}

export function getResourceKey<R extends RpcName>(methodName: R, { queryParams, rpcUrl }: GetResourceKeyParams<R> = {}) {
  if (queryParams !== undefined) {
    return [ 'customRpc', methodName, rpcUrl ?? null, queryParams ];
  }

  return [ 'customRpc', methodName, rpcUrl ?? null ];
}

export default function useCustomRpcApi<R extends RpcName, E = unknown, D = Array<RpcResponseItem<R>>>(
  methodName: R,
  { queryParams, queryOptions, logError, rpcUrl: rpcUrlProp }: Params<R, E, D> = {},
) {
  const fetch = useFetch();
  const rpcUrl = rpcUrlProp || chain.rpcUrls[0];

  return useQuery<Array<RpcResponseItem<R>>, ResourceError<E>, D>({
    queryKey: queryOptions?.queryKey || getResourceKey(methodName, { queryParams, rpcUrl }),
    queryFn: async({ signal }) => {
      if (!rpcUrl) {
        throw {
          status: 500,
          statusText: 'RPC URL is not configured',
        } as ResourceError<E>;
      }

      const requestBody: JsonRpcRequest<R> = {
        jsonrpc: '2.0',
        id: 1,
        method: methodName,
        ...(queryParams !== undefined ? { params: queryParams } : {}),
      };

      const response = await fetch<JsonRpcResponse<RpcResponseItem<R> | Array<RpcResponseItem<R>>>, E>(
        rpcUrl,
        {
          method: 'POST',
          body: requestBody as unknown as Record<string, unknown>,
          signal,
        },
        { logError },
      ) as JsonRpcResponse<RpcResponseItem<R> | Array<RpcResponseItem<R>>>;

      if (response.error) {
        throw {
          status: 500,
          statusText: response.error.message || 'RPC request failed',
          payload: response.error as E,
        } as ResourceError<E>;
      }

      return normalizeToArray<RpcResponseItem<R>>(response.result);
    },
    ...queryOptions,
  });
}
