import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Validator } from 'types/api/customData';

import useCustomRpcApi from 'lib/api/useCustomRpcApi';
import { formatAmount } from 'lib/utils/time';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import { tableColumns } from './data';

const RPC_FIELDS = new Set([ 'totalStake', 'ownerStake', 'nominators' ]);

interface Props {
  loading: boolean;
  data: Validator;
  index: number;
}

const ValidatorsListItem = ({ loading, data, index }: Props) => {
  const shouldFetchRpc = data.validatorStatus === 'Active' && Boolean(data.validatorAddress.trim());
  const rpcRes = useCustomRpcApi('staking_validatorInfo', {
    queryParams: shouldFetchRpc ? [ [ data.validatorAddress ] ] : undefined,
    queryOptions: {
      enabled: shouldFetchRpc,
    },
  });
  const validatorInfo = rpcRes.data?.[0];

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="130px auto">
      { tableColumns.map((col) => {
        let text = col.render?.(data, index);

        if (validatorInfo) {
          if (col.id === 'totalStake') {
            text = formatAmount(validatorInfo.total_staking);
          } else if (col.id === 'ownerStake') {
            text = formatAmount(validatorInfo.owner_staking);
          } else if (col.id === 'nominators') {
            text = validatorInfo.nominators;
          }
        }

        const isCellLoading = (
          loading ||
          (RPC_FIELDS.has(col.id) &&
            shouldFetchRpc &&
            rpcRes.isFetching)
        );

        return (
          <React.Fragment key={ col.id }>
            <ListItemMobileGrid.Label isLoading={ isCellLoading } >
              { col.label }
            </ListItemMobileGrid.Label>
            <ListItemMobileGrid.Value >
              <Box color="text.primary">
                <Skeleton loading={ isCellLoading } display="inline-block" minW={ 10 }>
                  { text }
                </Skeleton>
              </Box>
              { col.id === 'validatorName' && !loading && (
                <Box mt={ 2 } color="text.secondary">
                  <ValidatorEntity id={ data.validatorAddress }/>
                </Box>
              ) }
            </ListItemMobileGrid.Value>
          </React.Fragment>
        );
      }) }
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ValidatorsListItem);
