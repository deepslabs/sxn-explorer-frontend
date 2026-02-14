import type { CustomDataApiRequest, CustomDataPageResponse } from './common';

export type DeviceInfo = {
  totalCurrentStake: string;
  totalNextStake: string;
  totalReward: string;
  totalPunish: string;
  totalDevices: string;
  totalVoteDevices: string;
};

export type DHCDeviceStatus =
  | 'UnMount' |
  'TryQuit' |
  'Started' |
  'Join' |
  'Stopped' |
  'Offline' |
  'STANDBY' |
  'SERVING' |
  'EXITING';

export interface DHCDevice {
  deviceId: string;
  deviceVersion: string;
  createTime: string;
  status: DHCDeviceStatus;
  income: string;
  punish: string;
  punishCount: string;
  lastHeartBeat: string;
  totalStake: string;
  isAllowedStake: string;
  feeRatio: number;
  nextTotalStake: string;
  deviceOwner?: string;
}

export interface DeviceStatisticInfo {
  day: string;
  reward: string;
  punish: string;
}

export type DeviceStatisticInfos = Array<DeviceStatisticInfo>;

export type DevicesFlitterParams = CustomDataApiRequest<{ status?: DHCDeviceStatus; ownerAddress?: string }>;
export type DevicesResponse = CustomDataPageResponse<DHCDevice>;
