import type { ApiResource } from '../types';
import type {
  ValidatorDetails,
  ValidatorEpochInfo,
  ValidatorEraInfo,
  ValidatorsFlitterParams,
  ValidatorsResponse,
  ValidatorStatisticInfos,
} from 'types/api/customData';
import type { DeviceInfo, DevicesFlitterParams, DevicesResponse, DeviceStatisticInfos, DHCDevice } from 'types/api/customData/devices';

export const CUSTOM_DATA = {
  validators: {
    path: '/node/validators',
    paginated: true,
    filterFields: [
      'pageNo' as const,
      'pageSize' as const,
      'validatorStatus' as const,
      'searchStr' as const,
    ],
  },
  validatorDetail: {
    path: '/node/validator-detail',
    filterFields: [ 'address' as const ],
  },
  validatorStatistic: {
    path: '/node/validator-statistic',
    filterFields: [
      'address' as const,
      'startTime' as const,
      'endTime' as const,
    ],
  },
  validatorEpochInfo: {
    path: '/node/epoch-info',
    filterFields: [ 'counter' as const ],
  },
  validatorEraInfo: {
    path: '/node/era-info',
    filterFields: [ 'counter' as const ],
  },
  deviceInfo: {
    path: '/blockchain/device' + encodeURIComponent(':info'),
    filterFields: [ 'ownerAddress' as const ],
  },
  device: {
    path: '/blockchain/device',
    filterFields: [ 'deviceId' as const ],
  },
  deviceStatistic: {
    path: '/blockchain/device' + encodeURIComponent(':statistic'),
    filterFields: [
      'deviceId' as const,
      'startTime' as const,
      'endTime' as const,
    ],
  },
  devices: {
    path: '/blockchain/device' + encodeURIComponent(':owner'),
    paginated: true,
    filterFields: [
      'pageNo' as const,
      'pageSize' as const,
      'status' as const,
      'ownerAddress' as const,
    ],
  },
} satisfies Record<string, ApiResource>;

export type CustomDataApiResourceName =
  `customData:${ keyof typeof CUSTOM_DATA }`;

export type CustomDataApiResourcePayload<R extends CustomDataApiResourceName> =
  R extends 'customData:validators' ?
    ValidatorsResponse :
    R extends 'customData:validatorDetail' ?
      ValidatorDetails :
      R extends 'customData:validatorStatistic' ?
        ValidatorStatisticInfos :
        R extends 'customData:validatorEpochInfo' ?
          ValidatorEpochInfo :
          R extends 'customData:validatorEraInfo' ?
            ValidatorEraInfo :
            R extends 'customData:deviceInfo' ?
              DeviceInfo :
              R extends 'customData:device' ?
                DHCDevice :
                R extends 'customData:deviceStatistic' ?
                  DeviceStatisticInfos :
                  R extends 'customData:devices' ?
                    DevicesResponse :
                    never;

export type CustomDataApiPaginationFilters<
  R extends CustomDataApiResourceName,
> = R extends 'customData:validators' ?
  Partial<ValidatorsFlitterParams> :
  R extends 'customData:validatorDetail' ?
    Partial<{ address: string }> :
    R extends 'customData:validatorStatistic' ?
      Partial<{ address: string; startTime: string; endTime: string }> :
      R extends 'customData:validatorEpochInfo' ?
        Partial<{ counter: number | string }> :
        R extends 'customData:validatorEraInfo' ?
          Partial<{ counter: number | string }> :
          R extends 'customData:deviceInfo' ?
            Partial<{ ownerAddress?: string }> :
            R extends 'customData:device' ?
              Partial<{ deviceId: string }> :
              R extends 'customData:device' ?
                Partial<{ deviceId: string; startTime: string; endTime: string }> :
                R extends 'customData:devices' ?
                  Partial<DevicesFlitterParams> :
                  never;

export type CustomDataApiPaginationSorting = never;
