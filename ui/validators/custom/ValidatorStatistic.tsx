import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TimeChartItem } from 'toolkit/components/charts/types';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import { currencyUnits } from 'lib/units';
import { ChartWidget } from 'toolkit/components/charts/ChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';
import { WEI } from 'ui/shared/value/utils';

const ValidatorStatistic = ({ address }: { address: string }) => {
  const chartsConfig = useChartsConfig();

  const queryParams = React.useMemo(() => {
    return {
      startTime: dayjs().subtract(10, 'day').valueOf(),
      endTime: dayjs().valueOf(),
    };
  }, []);

  const { data, isPending, isError } = useApiQuery('customData:validatorStatistic', {
    queryParams: {
      address,
      ...queryParams,
    },
    queryOptions: {
      enabled: Boolean(address),
    },
  });

  const items = React.useMemo<Array<TimeChartItem>>(() => {
    if (!data) {
      return [];
    }

    return data.map((item) => {
      const timestamp = Number(item.day);
      const date = Number.isFinite(timestamp) && timestamp > 0 ? new Date(timestamp) : new Date(item.day);

      return {
        date,
        value: BigNumber(item.reward).dividedBy(WEI).toNumber(),
      };
    });
  }, [ data ]);

  const punishItems = React.useMemo<Array<TimeChartItem>>(() => {
    if (!data) {
      return [];
    }

    return data.map((item) => {
      const timestamp = Number(item.day);
      const date = Number.isFinite(timestamp) && timestamp > 0 ? new Date(timestamp) : new Date(item.day);

      return {
        date,
        value: BigNumber(item.punish).dividedBy(WEI).toNumber(),
      };
    });
  }, [ data ]);

  const rewardChart = React.useMemo(() => {
    return [ {
      id: 'reward',
      name: 'Reward',
      items,
      charts: chartsConfig,
      units: currencyUnits.ether,
    } ];
  }, [ chartsConfig, items ]);

  const punishChart = React.useMemo(() => {
    return [ {
      id: 'punish',
      name: 'Punish',
      items: punishItems,
      charts: chartsConfig,
      units: currencyUnits.ether,
    } ];
  }, [ chartsConfig, punishItems ]);

  return (
    <Grid
      templateColumns={{ lg: 'repeat(1, minmax(0, 1fr))' }}
      gap={ 4 }
      paddingTop={ 4 }
    >
      <ChartWidget
        charts={ rewardChart }
        title="Reward"
        isLoading={ isPending }
        isError={ isError }
        minH="230px"
      />

      <ChartWidget
        charts={ punishChart }
        title="Punish"
        isLoading={ isPending }
        isError={ isError }
        minH="230px"
      />
    </Grid>
  );
};

export default ValidatorStatistic;
