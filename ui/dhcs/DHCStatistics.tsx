import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { DeviceInfo } from 'types/api/customData';

import useApiQuery from 'lib/api/useApiQuery';
import { currencyUnits } from 'lib/units';
import { formatAmount } from 'lib/utils/time';
import type { IconName } from 'ui/shared/IconSvg';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const DHCStatistics = () => {
  const { data, isPending } = useApiQuery('customData:deviceInfo');

  const statsList = React.useMemo<
    Array<{
      id: keyof DeviceInfo;
      label: string;
      value: string;
      icon: IconName;
    }>
  >(() => {
    const getValue = (key: keyof DeviceInfo) => {
      const value = data?.[key] ?? '0';

      if (key === 'totalDevices') {
        return value;
      }

      return `${ formatAmount(value) } ${ currencyUnits.ether }`;
    };

    return [
      {
        id: 'totalDevices',
        label: 'Total DHCs',
        icon: 'custom/device',
        value: getValue('totalDevices'),
      },
      {
        id: 'totalCurrentStake',
        label: 'Total Stake',
        icon: 'custom/all',
        value: getValue('totalCurrentStake'),
      },
      {
        id: 'totalPunish',
        label: 'Total Punish',
        icon: 'custom/wating',
        value: getValue('totalPunish'),
      },
      {
        id: 'totalReward',
        label: 'Total Reward',
        icon: 'custom/active',
        value: getValue('totalReward'),
      },
    ];
  }, [ data ]);

  return (
    <Grid
      gridTemplateColumns={{
        lg: `repeat(${ statsList.length }, 1fr)`,
        base: '1fr 1fr',
      }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      { statsList.map((item) => {
        return (
          <StatsWidget
            key={ item.id }
            icon={ item.icon }
            label={ item.label }
            value={ item.value }
            isLoading={ isPending }
          />
        );
      }) }
    </Grid>
  );
};

export default React.memo(DHCStatistics);
