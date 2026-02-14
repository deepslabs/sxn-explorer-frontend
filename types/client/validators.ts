import type { ArrayElement } from 'types/utils';

export const VALIDATORS_CHAIN_TYPE = [
  'stability',
  'blackfort',
  'zilliqa',
  'custom', // custom chain validators
] as const;

export type ValidatorsChainType = ArrayElement<typeof VALIDATORS_CHAIN_TYPE>;
