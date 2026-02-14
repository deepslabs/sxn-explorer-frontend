import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import type { IconName } from 'public/icons/name';
import React from 'react';
import { clearInterval, setInterval, setTimeout } from 'timers';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import { secondToTime } from 'lib/utils/time';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const pagesParams = {
  pageNo: 1,
  pageSize: 1,
};
const ValidatorStats = () => {
  const allRes = useApiQuery('customData:validators', {
    queryParams: { ...pagesParams },
  });

  const waitRes = useApiQuery('customData:validators', {
    queryParams: {
      ...pagesParams,
      validatorStatus: 'Waiting',
    },
  });

  const activeRes = useApiQuery('customData:validators', {
    queryParams: {
      ...pagesParams,
      validatorStatus: 'Active',
    },
  });

  const [ eraCounter, setEraCounter ] = React.useState(() => 0);
  const [ epochCounter, setEpochCounter ] = React.useState(() => 0);

  const eraInfoRes = useApiQuery('customData:validatorEraInfo', {
    queryParams: {
      counter: eraCounter,
    },
  });
  const epochInfoRes = useApiQuery('customData:validatorEpochInfo', {
    queryParams: {
      counter: epochCounter,
    },
  });

  const leftStatsList = React.useMemo<
    Array<{
      id: string;
      label: string;
      value: string;
      loading: boolean;
      icon: IconName;
    }>
  >(() => {
    return [
      {
        id: 'all',
        label: 'All',
        value: BigNumber(allRes.data?.totalCount ?? '0')
          .dp(0)
          .toFormat(),
        loading: !allRes.data && allRes.isLoading,
        icon: 'custom/all',
      },
      {
        id: 'active',
        label: 'Active',
        value: BigNumber(activeRes.data?.totalCount ?? '0')
          .dp(0)
          .toFormat(),
        loading: !activeRes.data && activeRes.isLoading,
        icon: 'custom/active',
      },
      {
        id: 'wait',
        label: 'Waiting',
        value: BigNumber(waitRes.data?.totalCount ?? '0')
          .dp(0)
          .toFormat(),
        loading: !waitRes.data && waitRes.isLoading,
        icon: 'custom/wating',
      },
    ];
  }, [
    allRes.data,
    waitRes.data,
    activeRes.data,
    allRes.isLoading,
    waitRes.isLoading,
    activeRes.isLoading,
  ]);

  const [ eraTime, setEraTime ] = React.useState<number>(() => -1);
  const [ epochTime, setEpochTime ] = React.useState<number>(() => -1);

  const rightStatsList = React.useMemo<
    Array<{
      id: string;
      label: string;
      value: string;
      loading: boolean;
      icon: IconName;
    }>
  >(() => {
    return [
      {
        id: 'epoch',
        label: `Epoch ${ Number(epochInfoRes.data?.epochDuration ?? '0') / 60 }m`,
        value: secondToTime(epochTime ?? 0),
        loading: epochInfoRes.isLoading,
        icon: 'custom/timer',
      },
      {
        id: 'era',
        label: `Era ${ Number(eraInfoRes.data?.eraDuration ?? '0') / 60 }m`,
        value: secondToTime(eraTime ?? 0),
        loading: eraInfoRes.isLoading,
        icon: 'custom/timer',
      },
    ];
  }, [
    eraInfoRes.data,
    epochInfoRes.data,
    eraTime,
    epochTime,
    eraInfoRes.isLoading,
    epochInfoRes.isLoading,
  ]);

  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    let timer: NodeJS.Timeout | undefined;

    if (eraInfoRes.data) {
      const time = eraInfoRes.data.eraStartTime;
      // 数据为Null 或者 undefined时 每5秒请求一次数据
      if (time === null || time === undefined) {
        // if (eraTime !== 0) {
        //   setEraTime(0);
        // }
        if (timer) {
          clearInterval(timer);
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          setEraCounter((val) => val + 1);
        }, 5000);
      } else {
        const diff = Math.floor(
          (Number(dayjs().valueOf()) - Number(time)) / 1000,
        );

        setEraTime(() => Number(eraInfoRes.data.eraDuration) - diff);

        timer = setInterval(() => {
          setEraTime((val) => (val <= 0 ? 0 : val - 1));
        }, 1000);
      }
    }

    return () => {
      if (timer) {
        setEraTime(0);
        clearInterval(timer);
        clearTimeout(timer);
      }
    };
  }, [ eraInfoRes.data ]);

  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    let timer: NodeJS.Timeout | undefined;

    if (epochInfoRes.data) {
      const time = epochInfoRes.data.epochStartTime;
      // 数据为Null 或者 undefined时 每5秒请求一次数据
      if (time === null || time === undefined) {
        // if (epochTime !== 0) {
        //   setEpochTime(() => 0);
        // }
        if (timer) {
          clearInterval(timer);
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          setEpochCounter((val) => val + 1);
        }, 5000);
      } else {
        const diff = Math.floor(
          (Number(dayjs().valueOf()) - Number(time)) / 1000,
        );

        setEpochTime(() => Number(epochInfoRes.data.epochDuration) - diff);

        timer = setInterval(() => {
          setEpochTime((val) => (val <= 0 ? 0 : val - 1));
        }, 1000);
      }
    }

    return () => {
      if (timer) {
        setEpochTime(0);
        clearInterval(timer);
        clearTimeout(timer);
      }
    };
  }, [ epochInfoRes.data ]);

  React.useEffect(() => {
    if (epochTime === 0) {
      setEpochCounter((val) => val + 1);
    } else if (eraTime === 0) {
      setEraCounter((val) => val + 1);
    }
  }, [ epochTime, eraTime ]);

  return (
    <Grid
      gridTemplateColumns={{
        lg: `repeat(${ leftStatsList.length + rightStatsList.length }, 1fr)`,
        base: '1fr 1fr',
      }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      { leftStatsList.map((item) => {
        return (
          <StatsWidget
            key={ item.id }
            icon={ item.icon }
            label={ item.label }
            value={ item.value }
            isLoading={ item.loading }
          />
        );
      }) }

      { rightStatsList.map((item) => {
        return (
          <StatsWidget
            key={ item.id }
            icon={ item.icon }
            label={ item.label }
            value={ item.value }
            isLoading={ item.loading }
          />
        );
      }) }
    </Grid>
  );
};

export default React.memo(ValidatorStats);
