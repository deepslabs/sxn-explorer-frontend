import { Box, createListCollection, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';

import { statusList } from './data';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  validatorStatus: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValidatorStatusChange?: (details: any) => void;
}
const ValidatorsTableBar = ({
  onSearchChange,
  searchTerm,
  validatorStatus = 'All',
  onValidatorStatusChange,
  pagination,
}: Props) => {
  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      onChange={ onSearchChange }
      placeholder="Search by validator"
      initialValue={ searchTerm }
    />
  );

  const collection = createListCollection<SelectOption>({
    items: statusList,
  });

  const selector = (
    <Select
      collection={ collection }
      value={ [ validatorStatus ] }
      onValueChange={ onValidatorStatusChange }
      placeholder="Select type"/>
  );

  // const actionBar = pagination.isVisible && (
  //   <ActionBar py="0">
  //     <Pagination ml="auto" {...pagination} />
  //   </ActionBar>
  // );

  return (
    <ActionBar>
      <Box w="100%">
        <Grid
          gap={ 2 }
          templateAreas={{
            base: `"section input" "actions actions"`,
            lg: `"section input actions"`,
          }}
          gridTemplateColumns={{
            base: 'auto minmax(0, 1fr)',
            lg: 'auto 1fr auto',
          }}
        >
          <GridItem w="auto" minW={ 0 } area="section" justifySelf="start">
            { selector }
          </GridItem>
          <GridItem w="100%" minW={ 0 } area="input">
            { searchInput }
          </GridItem>

          <GridItem w={{ base: '100%', lg: 'auto' }} area="actions">
            <Pagination ml="auto" justifyContent="flex-end" { ...pagination }/>
          </GridItem>
        </Grid>
      </Box>
    </ActionBar>
  );
};

export default ValidatorsTableBar;
