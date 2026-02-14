export type StakeValidatorInfoParams = Array<Array<string>>;
export type ValidatorInfoParams = Array<number>;

export interface StakeValidatorInfo {
  stash_account: string;
  state: boolean;
  total_staking: string;
  owner_staking: string;
  nominators: string;
  commission: string;
  can_nominated: boolean;
}

export interface ValidatorInfo {
  pid: string;
  owner: string;
  cap_pledge: string;
  total_pledge: string;
  devices_num: string;
  total_punishment: string;
  total_rewards: string;
  unpaid_rewards: string;
}
