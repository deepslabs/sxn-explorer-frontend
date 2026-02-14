import React from 'react';

import isBodyAllowed from 'lib/api/isBodyAllowed';
import type { ResourceError, ResourcePath } from 'lib/api/resources';
import { useRollbar } from 'lib/rollbar';

export interface Params {
  method?: RequestInit['method'];
  headers?: RequestInit['headers'];
  signal?: RequestInit['signal'];
  body?: Record<string, unknown> | FormData;
  credentials?: RequestCredentials;
}

interface Meta {
  resource?: ResourcePath;
  logError?: boolean;
}

export default function useFetch() {
  const rollbar = useRollbar();

  return React.useCallback(<Success, Error>(path: string, params?: Params, meta?: Meta): Promise<Success | ResourceError<Error>> => {
    const _body = params?.body;
    const isFormData = _body instanceof FormData;
    const withBody = isBodyAllowed(params?.method);

    const body: FormData | string | undefined = (() => {
      if (!withBody) {
        return;
      }

      if (isFormData) {
        return _body;
      }

      return JSON.stringify(_body);
    })();

    const reqParams = {
      ...params,
      body,
      headers: {
        ...(withBody && !isFormData ? { 'Content-type': 'application/json' } : undefined),
        ...params?.headers,
      },
    };

    return fetch(path, reqParams).then(response => {

      const isJson = response.headers.get('content-type')?.includes('application/json');

      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
          rateLimits: {
            bypassOptions: response.headers.get('bypass-429-option'),
            reset: response.headers.get('x-ratelimit-reset'),
          },
        };

        if (meta?.logError && rollbar) {
          rollbar.warn('Client fetch failed', {
            resource: meta?.resource,
            status_code: error.status,
            status_text: error.statusText,
          });
        }

        if (!isJson) {
          return response.text().then(
            (textError) => Promise.reject({
              ...error,
              payload: textError,
            }),
          );
        }

        return response.json().then(
          (jsonError) => Promise.reject({
            ...error,
            payload: jsonError as Error,
          }),
          () => {
            return Promise.reject(error);
          },
        );

      } else {
        if (isJson) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return response.json().then((res: any) => {
            // custom data
            if (res?.code) {
              if (res?.code === '000') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const _data = res['data'] as any;
                if (_data['items']) {
                  const total = Number(_data.pageNo) * Number(_data.pageSize);
                  const all = Number(_data.totalCount || '0');

                  return Promise.resolve({ ..._data, next_page_params: total < all ? { items_count: total } : null });
                }
                return Promise.resolve(_data);
              } else {
                return Promise.reject(res['message']);
              }
            } else {
              return Promise.resolve(res);
            }
          }) as Promise<Success>;
        }

        return Promise.resolve() as Promise<Success>;
      }
    });
  }, [ rollbar ]);
}
