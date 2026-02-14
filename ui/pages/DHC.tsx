import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { formatAmount } from 'lib/utils/time';
import DHCDetails from 'ui/dhcs/DHCDetails';
import DHCStatistic from 'ui/dhcs/DHCStatistic';
import PageTitle from 'ui/shared/Page/PageTitle';

const HDCContext: React.FC = () => {
  const router = useRouter();
  const deviceId = router.query.id;

  const { data, isLoading } = useApiQuery('customData:device', {
    queryParams: {
      deviceId: deviceId,
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <PageTitle title="DHC Details" withTextAd/>
      { deviceId && (
        <DHCDetails
          deviceDetails={ data }
          isLoading={ isLoading }
        />
      ) }
      { deviceId && (
        <DHCStatistic
          deviceId={ deviceId as string }
          totalPunish={ formatAmount(data?.punish ?? '0') }
          totalReward={ formatAmount(data?.income ?? '0') }
          punishCount={ Number(data?.punishCount ?? 0) }
          isLoaded={ true }
        />
      ) }
    </div>
  );
};

export default HDCContext;
