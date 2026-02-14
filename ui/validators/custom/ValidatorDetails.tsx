import React from 'react';

import type { StakeValidatorInfo } from 'types/api/customData/rpc';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import { currencyUnits } from 'lib/units';
import { formatAmount } from 'lib/utils/time';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

function formatRegistrationTime(value: string | undefined) {
  const timestamp = Number(value);

  if (!timestamp) {
    return '-';
  }

  return dayjs(timestamp).format(DATE_FORMAT);
}

function formatStake(value: string | undefined) {
  return `${ formatAmount(value ?? '0') } ${ currencyUnits.ether }`;
}

const ValidatorDetails = ({
  address,
  validator,
  loading,
}: {
  address: string;
  validator?: StakeValidatorInfo;
  loading: boolean;
}) => {
  const { data, isPending } = useApiQuery('customData:validatorDetail', {
    queryParams: {
      address,
    },
    queryOptions: {
      enabled: Boolean(address),
    },
  });
  const isLoading = isPending || loading;

  const items = React.useMemo(() => {
    const allowNominator = data?.validatorAllowNominator;
    const allowNominatorValue = (() => {
      if (allowNominator === undefined) {
        return '-';
      }

      return String(allowNominator) === 'true' ? 'Yes' : 'No';
    })();

    return [
      { id: 'name', label: 'Name', value: data?.validatorName },
      { id: 'fee', label: 'Fee', value: `${ data?.validatorFeeRatio ?? '0' }%` },
      { id: 'status', label: 'Status', value: data?.validatorStatus ?? '-' },
      {
        id: 'allowNominator',
        label: 'Allow nominator',
        value: allowNominatorValue,
      },
      {
        id: 'nominators',
        label: 'Nominators',
        value: validator?.nominators ?? '-',
      },
      {
        id: 'totalStake',
        label: 'Total Stake',
        value: formatStake(validator?.total_staking),
      },
      {
        id: 'ownerStake',
        label: 'Owner Stake',
        value: formatStake(validator?.owner_staking),
      },
      {
        id: 'createTime',
        label: 'Create Time',
        value: formatRegistrationTime(data?.validatorRegistrationTime),
      },
    ];
  }, [ data, validator ]);

  return (
    <DetailedInfo.Container>
      { items.map((item) => {
        return (
          <React.Fragment key={ item.id }>
            <DetailedInfo.ItemLabel isLoading={ isLoading }>{ item.label }</DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Skeleton loading={ isLoading } display="inline-block">
                <span>{ item.value }</span>
              </Skeleton>
            </DetailedInfo.ItemValue>
          </React.Fragment>
        );
      }) }
    </DetailedInfo.Container>
  );
};

export default ValidatorDetails;
