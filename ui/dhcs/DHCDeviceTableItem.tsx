import React from 'react';

import type { DHCDevice } from 'types/api/customData';

import { route } from 'nextjs-routes';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import * as EntityBase from 'ui/shared/entities/base/components';

import { tableColumns } from './data';
import DHCDeviceConnection from './DHCDeviceConnection';
import DHCStatusTag from './DHCStatusTag';

interface Props {
  data: DHCDevice;
  isLoading?: boolean;
}

const DHCDeviceTableItem = ({ data, isLoading }: Props) => {
  return (
    <TableRow>
      { tableColumns.map((col) => {
        let content = col.render?.(data);

        if (col.id === 'deviceId') {
          content = (
            <EntityBase.Container flexDirection="column" alignItems="start">
              <EntityBase.Link
                href={ route({
                  pathname: '/dhcs/[id]',
                  query: { id: data.deviceId },
                }) }
              >
                <EntityBase.Content
                  truncation="constant_long"
                  fontWeight={ 700 }
                  text={ data.deviceId }
                  maxW="100%"
                  isLoading={ isLoading }
                />
              </EntityBase.Link>

              <DHCDeviceConnection
                time={ Number(data.lastHeartBeat ?? 0) }
              />
            </EntityBase.Container>
          );
        } else if (col.id === 'deviceStatus') {
          content = <DHCStatusTag status={ data.status } isLoading={ isLoading }/>;
        }

        return (
          <TableCell key={ col.id } width={ col.width } textAlign={ col.textAlgin }>
            <Skeleton
              loading={ isLoading }
              display="inline-block"
              minW={ 10 }
              lineHeight="24px"
            >
              { content }
            </Skeleton>
          </TableCell>
        );
      }) }
    </TableRow>
  );
};

export default React.memo(DHCDeviceTableItem);
