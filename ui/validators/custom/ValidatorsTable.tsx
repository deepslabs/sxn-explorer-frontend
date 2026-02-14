import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import { VALIDATOR_CUSTOM } from 'stubs/validators';
import {
  TableBody,
  TableColumnHeader,
  TableHeaderSticky,
  TableRoot,
  TableRow,
} from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import { tableColumns } from './data';
import ValidatorsListItem from './ValidatorsListItem';
import ValidatorsTableBar from './ValidatorsTableBar';
import ValidatorsTableItem from './ValidatorsTableItem';

const PAGE_SIZE = 10;

const ValidatorsTable: React.FC = () => {
  const router = useRouter();
  const searchStr = getQueryParamString(router.query.searchStr);

  const [ validatorStatus, setValidatorStatus ] = React.useState<
    'Waiting' | 'Active' | 'All' | undefined
  >(
    (getQueryParamString(router.query.validatorStatus) as
      | 'Waiting' |
      'Active' |
      'All' |
      undefined) || 'All',
  );
  const [ searchTerm, setSearchTerm ] = React.useState<string>(searchStr ?? '');

  const pageNo = useMemo<number>(() => {
    return Number((router.query.page as string) || 1);
  }, [ router ]);

  const {
    data,
    isError,
    pagination,
    isLoading,
    isPlaceholderData,
    onFilterChange,
  } = useQueryWithPages({
    resourceName: 'customData:validators',
    queryParams: {
      pageNo: pageNo,
      pageSize: PAGE_SIZE,
      searchStr: searchTerm,
      validatorStatus: validatorStatus === 'All' ? undefined : validatorStatus,
    },
    options: {
      placeholderData: (data) => {
        if (data) return data;
        return {
          items: Array(PAGE_SIZE).fill(VALIDATOR_CUSTOM),
          pageNo: 1,
          pageSize: 10,
          totalPage: 1,
          totalCount: '10',
          hasPrev: false,
          hasNext: false,
          next_page_params: null,
        };
      },
    },
  });

  const handleSearchTermChange = React.useCallback(
    (val: string) => {
      onFilterChange({ searchStr: val });
      setSearchTerm(val);
    },
    [ onFilterChange ],
  );
  const handValidatorStatusChange = React.useCallback(
    ({ value }: { value: Array<'Waiting' | 'Active' | 'All' | undefined> }) => {
      const id = value[0];
      onFilterChange({ validatorStatus: id === 'All' ? undefined : id });
      setValidatorStatus(id);
    },
    [ onFilterChange ],
  );

  const dataSource = React.useMemo(() => {
    return data?.items ?? [];
  }, [ data ]);
  const isItemsLoading = isLoading || isPlaceholderData;

  const content = (
    <>
      <Box display={{ base: 'none', lg: 'block' }}>
        <TableRoot minWidth={{ base: '1200px', lg: '1000px' }}>
          <TableHeaderSticky
            top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          >
            <TableRow>
              { tableColumns.map((item) => {
                return (
                  <TableColumnHeader
                    key={ item.id }
                    width={ item.width }
                    textAlign={ item.textAlgin }
                  >
                    { item.label }
                  </TableColumnHeader>
                );
              }) }
            </TableRow>
          </TableHeaderSticky>

          <TableBody>
            { dataSource.map((item, index) => {
              return (
                <ValidatorsTableItem
                  key={ (item.validatorAddress || 'placeholder') + (isPlaceholderData ? String(index) : '') }
                  data={ item }
                  loading={ isItemsLoading }
                  index={ index }
                />
              );
            }) }
          </TableBody>
        </TableRoot>
      </Box>

      <Box display={{ base: 'block', lg: 'none' }}>
        { dataSource.map((item, index) => {
          return (
            <ValidatorsListItem
              key={ (item.validatorAddress || 'placeholder') + (isPlaceholderData ? String(index) : '') }
              data={ item }
              loading={ isItemsLoading }
              index={ index }
            />
          );
        }) }
      </Box>
    </>
  );

  return (
    <div style={{ paddingTop: '24px' }}>
      <ValidatorsTableBar
        pagination={ pagination }
        searchTerm={ searchTerm }
        onSearchChange={ handleSearchTermChange }
        validatorStatus={ validatorStatus ?? 'All' }
        onValidatorStatusChange={ handValidatorStatusChange }
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ dataSource.length }
        emptyText="There are no validators.">
        { content }
      </DataListDisplay>
    </div>
  );
};

export default ValidatorsTable;
