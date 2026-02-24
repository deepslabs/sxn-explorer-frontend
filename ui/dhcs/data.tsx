import type { ReactNode } from 'react';

import type { DHCDevice } from 'types/api/customData';

import dayjs from 'lib/date/dayjs';
import { currencyUnits } from 'lib/units';
import { formatAmount } from 'lib/utils/time';

export interface TableColumn<T> {
  id: string;
  label: string;
  width?: string;
  textAlgin?:
  'left' | 'right' | 'center' | 'justify' | 'char';
  render?: (data: T, index?: number) => ReactNode;
}

export const tableColumns: Array<TableColumn<DHCDevice>> = [
  {
    id: 'deviceId',
    label: 'DID',
    width: '140px',
    textAlgin: 'left',
    render: (data) => {
      return data.deviceId;
    },
  },
  {
    id: 'deviceVersion',
    label: 'Version',
    width: '100px',
    textAlgin: 'center',
    render: (data) => {
      return data.deviceVersion;
    },
  },
  {
    id: 'deviceMode',
    label: 'Mode',
    width: '100px',
    textAlgin: 'center',
    render: (data) => {
      if (data.deviceMode === 0) {
        return 'Community';
      } else if (data.deviceMode === 1) {
        return 'Authority';
      }
      return 'BootNode';
    },
  },
  {
    id: 'deviceStatus',
    label: 'Status',
    width: '140px',
    textAlgin: 'center',
  },
  {
    id: 'createTime',
    label: 'Created',
    width: '160px',
    textAlgin: 'center',
    render: (data) => {
      return dayjs(Number(data.createTime)).format('YYYY-MM-DD HH:mm');
    },
  },
  {
    id: 'totalStake',
    label: `Stake ${ currencyUnits.ether }`,
    width: '140px',
    textAlgin: 'right',
    render: (data) => {
      return formatAmount(data.totalStake);
    },
  },
  {
    id: 'nextTotalStake',
    label: `Next Stake ${ currencyUnits.ether }`,
    width: '160px',
    textAlgin: 'right',
    render: (data) => {
      return formatAmount(data.nextTotalStake);
    },
  },
  {
    id: 'punish',
    label: `Punish ${ currencyUnits.ether }`,
    width: '140px',
    textAlgin: 'right',
    render: (data) => {
      return formatAmount(data.punish);
    },
  },
  {
    id: 'income',
    label: `Reward ${ currencyUnits.ether }`,
    width: '140px',
    textAlgin: 'right',
    render: (data) => {
      return formatAmount(data.income);
    },
  },
];
