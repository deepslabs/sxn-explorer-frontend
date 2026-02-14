import React from 'react';

import type { DHCDeviceStatus } from 'types/api/customData';

import { Tag } from 'toolkit/chakra/tag';

const STATUS_LABELS: Record<DHCDeviceStatus, string> = {
  UnMount: 'Not listed',
  TryQuit: 'Exiting service',
  Started: 'Running',
  Join: 'In service',
  Stopped: 'Stopped',
  Offline: 'Offline',
  STANDBY: 'Standby',
  SERVING: 'Serving',
  EXITING: 'Exiting',
};

const STATUS_COLORS: Record<DHCDeviceStatus, { backgroundColor: string; color: string }> = {
  UnMount: {
    backgroundColor: 'rgba(154, 154, 154, 0.18)',
    color: '#595959',
  },
  TryQuit: {
    backgroundColor: 'rgba(255, 229, 143, 0.18)',
    color: '#faad14',
  },
  Started: {
    backgroundColor: 'rgba(117, 255, 177, 0.18)',
    color: '#52c41a',
  },
  Join: {
    backgroundColor: 'rgba(117, 255, 177, 0.18)',
    color: '#52c41a',
  },
  Stopped: {
    backgroundColor: 'rgba(255, 120, 117, 0.18)',
    color: '#ff4d4f',
  },
  Offline: {
    backgroundColor: 'rgba(255, 120, 117, 0.18)',
    color: '#ff4d4f',
  },
  STANDBY: {
    backgroundColor: 'rgba(255, 229, 143, 0.4)',
    color: '#faad14',
  },
  SERVING: {
    backgroundColor: 'rgba(117, 255, 177, 0.18)',
    color: '#52c41a',
  },
  EXITING: {
    backgroundColor: 'rgba(154, 154, 154, 0.18)',
    color: '#595959',
  },
};

const FALLBACK_STATUS: DHCDeviceStatus = 'UnMount';

interface Props {
  status?: DHCDeviceStatus | null;
  isLoading?: boolean;
}

const DHCStatusTag = ({ status, isLoading }: Props) => {
  const currentStatus = status || FALLBACK_STATUS;
  const currentStyle = STATUS_COLORS[currentStatus];

  return (
    <Tag
      width="100px"
      size="lg"
      borderRadius="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor={ currentStyle.backgroundColor }
      color={ currentStyle.color }
      loading={ isLoading }
    >
      { STATUS_LABELS[currentStatus] }
    </Tag>
  );
};

export default React.memo(DHCStatusTag);
