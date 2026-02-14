import type { CustomDataApiRequest, CustomDataPageResponse } from './common';

export type Validator = {
  validatorName: string;
  validatorIncomeDistributionType: string;
  validatorAddress: string;
  validatorStatus: string;
  validatorFeeRatio: string;
  validatorAllowNominator: boolean;
  validatorLastBlock: null | string;
  validatorRegistrationTime: string;
};

export type ValidatorsFlitterParams = CustomDataApiRequest<{ validatorStatus?: 'Waiting' | 'Active' ; searchStr?: string }>;
export type ValidatorsResponse = CustomDataPageResponse<Validator>;

export type ValidatorEpochInfo = {
  epochStartTime: number;
  epochDuration: number;
};

export type ValidatorEraInfo = {
  eraStartTime: number;
  eraDuration: number;
};

export interface ValidatorDetails {
  validatorIncomeDistributionType: string;
  validatorStatus: string;
  validatorAllowNominator: string;
  validatorAddress: string;
  validatorName: string;
  validatorFeeRatio: string;
  validatorLastBlock: string;
  validatorRegistrationTime: string;
}

export interface ValidatorStatisticInfo {
  day: string;
  reward: string;
  punish: string;
}

export type ValidatorStatisticInfos = Array<ValidatorStatisticInfo>;
