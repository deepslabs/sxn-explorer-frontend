import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { DHCDevice } from 'types/api/customData';

import dayjs from 'lib/date/dayjs';
import { currencyUnits } from 'lib/units';
import { formatAmount } from 'lib/utils/time';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import DHCDeviceConnection from './DHCDeviceConnection';
import DHCStatusTag from './DHCStatusTag';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

function formatTimestamp(value: string | undefined) {
  const timestamp = Number(value);

  if (!timestamp) {
    return '-';
  }

  return dayjs(timestamp).format(DATE_FORMAT);
}

function formatStake(value: string | undefined) {
  return `${ formatAmount(value ?? '0') } ${ currencyUnits.ether }`;
}

interface Props {
  deviceDetails?: DHCDevice;
  isLoading: boolean;
}

const DHCDetails = ({ deviceDetails, isLoading }: Props) => {
  const items = React.useMemo(() => {
    return [
      {
        id: 'deviceId',
        label: 'Device',
        value: <HashStringShortenDynamic hash={ deviceDetails?.deviceId ?? '' }/>,
        copyText: deviceDetails?.deviceId,
        isHash: true,
      },
      {
        id: 'deviceVersion',
        label: 'Version',
        value: deviceDetails?.deviceVersion || '-',
      },
      {
        id: 'deviceMode',
        label: 'Mode',
        value: (() => {
          if (deviceDetails?.deviceMode === 0) {
            return 'Community';
          } else if (deviceDetails?.deviceMode === 1) {
            return 'Authority';
          }
          return 'BootNode';
        })(),
      },
      {
        id: 'deviceOwner',
        label: 'Device owner',
        value: <HashStringShortenDynamic hash={ deviceDetails?.deviceOwner ?? '' }/>,
        copyText: deviceDetails?.deviceOwner,
        isHash: true,
      },
      {
        id: 'allowVotes',
        label: 'Voting',
        value: (
          <Text color={ String(deviceDetails?.isAllowedStake) === 'true' ? 'green.500' : 'red.500' }>
            { String(deviceDetails?.isAllowedStake) === 'true' ?
              'Allow new votes' :
              'Refuse new votes' }
          </Text>
        ),
      },
      {
        id: 'feeRatio',
        label: 'Commission',
        value: `${ deviceDetails?.feeRatio ?? 0 }%`,
      },
      {
        id: 'status',
        label: 'Status',
        value: (
          <Flex alignItems="center" gap={ 2 }>
            <DHCStatusTag status={ deviceDetails?.status } isLoading={ isLoading }/>
            <DHCDeviceConnection time={ Number(deviceDetails?.lastHeartBeat ?? 0) }/>
          </Flex>
        ),
      },
      {
        id: 'stake',
        label: 'Stake',
        value: formatStake(deviceDetails?.totalStake),
      },
      {
        id: 'nextTotalStake',
        label: 'Next stake',
        value: formatStake(deviceDetails?.nextTotalStake),
      },
      {
        id: 'createTime',
        label: 'Created',
        value: formatTimestamp(deviceDetails?.createTime),
      },
    ];
  }, [ deviceDetails, isLoading ]);

  return (
    <DetailedInfo.Container>
      { items.map((item) => {
        return (
          <React.Fragment key={ item.id }>
            <DetailedInfo.ItemLabel isLoading={ isLoading }>{ item.label }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap={ item.isHash ? 'nowrap' : undefined }>
              <Skeleton loading={ isLoading } display="inline-flex" alignItems="center" overflow={ item.isHash ? 'hidden' : undefined }>
                { item.value }
              </Skeleton>
              { item.copyText && (
                <CopyToClipboard
                  text={ item.copyText }
                  isLoading={ isLoading }
                  ml={ 2 }
                />
              ) }
            </DetailedInfo.ItemValue>
          </React.Fragment>
        );
      }) }
    </DetailedInfo.Container>
  );
};

export default React.memo(DHCDetails);
