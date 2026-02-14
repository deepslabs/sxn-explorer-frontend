import React from 'react';

import type { Validator } from 'types/api/customData';

import useCustomRpcApi from 'lib/api/useCustomRpcApi';
import { formatAmount } from 'lib/utils/time';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';

import { tableColumns } from './data';

const RPC_FIELDS = new Set([ 'totalStake', 'ownerStake', 'nominators' ]);

const ValidatorsTableItem = ({
  loading,
  data,
  index,
}: {
  loading: boolean;
  data: Validator;
  index: number;
}) => {
  const shouldFetchRpc = data.validatorStatus === 'Active' && Boolean(data.validatorAddress.trim());
  const rpcRes = useCustomRpcApi('staking_validatorInfo', {
    queryParams: shouldFetchRpc ? [ [ data.validatorAddress ] ] : undefined,
    queryOptions: {
      enabled: shouldFetchRpc,
    },
  });
  const validatorInfo = rpcRes.data?.[0];

  return (
    <TableRow >
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
          <TableCell key={ col.id } width={ col.width } textAlign={ col.textAlgin }>
            <Skeleton
              loading={ isCellLoading }
              display="inline-block"
              minW={ 10 }
              lineHeight="24px"
            >
              { text }
            </Skeleton>
            { col.id === 'validatorName' && !loading ? (
              <ValidatorEntity id={ data.validatorAddress }/>
              // <Flex>
              //   <EntityBase.Link
              //     href={ route({
              //       pathname: '/validators/[id]',
              //       query: { id: data.validatorAddress },
              //     }) }
              //   >
              //     <EntityBase.Content
              //       truncation="constant"
              //       fontWeight={ 700 }
              //       text={ data.validatorAddress }
              //       maxW="100%"
              //       isLoading={ loading }
              //     />
              //   </EntityBase.Link>
              //   <EntityBase.Copy
              //     text={ data.validatorAddress }
              //     // by default we don't show copy icon, maybe this should be revised
              //     noCopy={ false }
              //   />
              // </Flex>
            ) : undefined }
          </TableCell>
        );
      }) }
    </TableRow>
  );
};

export default React.memo(ValidatorsTableItem);
