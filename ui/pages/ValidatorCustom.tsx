import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import useCustomRpcApi from 'lib/api/useCustomRpcApi';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import ValidatorDetails from 'ui/validators/custom/ValidatorDetails';
import ValidatorStatistic from 'ui/validators/custom/ValidatorStatistic';

const ValidatorCustom: React.FC = () => {
  const router = useRouter();

  const validatorAddress = useMemo(() => {
    return getQueryParamString(router.query.id);
  }, [ router ]);
  const hasAddress = Boolean(validatorAddress);

  const rpcRes = useCustomRpcApi('staking_validatorInfo', {
    queryParams: hasAddress ? [ [ validatorAddress ] ] : undefined,
    queryOptions: {
      enabled: hasAddress,
    },
  });

  const validatorInfo = rpcRes.data?.[0];

  return (
    <>
      <PageTitle title="Validator details" withTextAd/>
      <Flex
        alignItems="center"
        w="100%"
        columnGap={ 2 }
        rowGap={ 2 }
        paddingBottom="20px"
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
      >
        <AddressEntity
          address={{
            hash: validatorAddress,
            name: '',
            ens_domain_name: '',
          }}
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
          noLink
          mr={ 4 }
        />
      </Flex>

      { validatorAddress && (
        <ValidatorDetails
          address={ validatorAddress }
          validator={ validatorInfo }
          loading={ rpcRes.isLoading }
        />
      ) }
      { validatorAddress && (
        <ValidatorStatistic address={ validatorAddress }/>
      ) }
    </>
  );
};

export default ValidatorCustom;
