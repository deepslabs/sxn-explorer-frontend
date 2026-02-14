import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { DHC } from 'stubs/dhcs';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import { tableColumns } from './data';
import DHCDeviceListItem from './DHCDeviceListItem';
import DHCDeviceTableItem from './DHCDeviceTableItem';

const PAGE_SIZE = 10;

const DHCDevicesTable = () => {
  const router = useRouter();

  const pageNo = React.useMemo<number>(() => {
    return Number((router.query.page as string) || 1);
  }, [ router ]);

  const {
    data,
    isError,
    pagination,
    isPlaceholderData,
  } = useQueryWithPages({
    resourceName: 'customData:devices',
    queryParams: {
      pageNo,
      pageSize: PAGE_SIZE,
    },
    options: {
      placeholderData: (prevData) => {
        if (prevData) {
          return prevData;
        }

        return {
          items: Array(PAGE_SIZE).fill(DHC),
          pageNo: 1,
          pageSize: PAGE_SIZE,
          totalPage: 1,
          totalCount: String(PAGE_SIZE),
          hasPrev: false,
          hasNext: false,
          next_page_params: null,
        };
      },
    },
  });

  const dataSource = React.useMemo(() => {
    return data?.items ?? [];
  }, [ data?.items ]);

  const actionBar = pagination.isVisible ? (
    <ActionBar>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = (
    <>
      <Box display={{ base: 'none', lg: 'block' }}>
        <TableRoot minWidth={{ base: '1200px', lg: '1000px' }}>
          <TableHeaderSticky top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }>
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
                <DHCDeviceTableItem
                  key={ item.deviceId + (isPlaceholderData ? String(index) : '') }
                  data={ item }
                  isLoading={ isPlaceholderData }
                />
              );
            }) }
          </TableBody>
        </TableRoot>
      </Box>

      <Box display={{ base: 'block', lg: 'none' }}>
        { dataSource.map((item, index) => {
          return (
            <DHCDeviceListItem
              key={ item.deviceId + (isPlaceholderData ? String(index) : '') }
              data={ item }
              isLoading={ isPlaceholderData }
            />
          );
        }) }
      </Box>
    </>
  );

  return (
    <Box paddingTop={ 6 }>
      <DataListDisplay
        isError={ isError }
        itemsNum={ dataSource.length }
        emptyText="There are no providers."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </Box>
  );
};

export default DHCDevicesTable;
