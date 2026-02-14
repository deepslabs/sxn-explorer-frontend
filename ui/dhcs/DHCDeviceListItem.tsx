import React from 'react';

import type { DHCDevice } from 'types/api/customData';

import { route } from 'nextjs-routes';

import { Skeleton } from 'toolkit/chakra/skeleton';
import * as EntityBase from 'ui/shared/entities/base/components';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import { tableColumns } from './data';
import DHCDeviceConnection from './DHCDeviceConnection';
import DHCStatusTag from './DHCStatusTag';

interface Props {
  data: DHCDevice;
  isLoading?: boolean;
}

const DHCDeviceListItem = ({ data, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container>
      { tableColumns.map((col) => {
        let content = col.render?.(data);

        if (col.id === 'deviceId') {
          content = (
            <EntityBase.Container >
              <EntityBase.Link
                href={ route({
                  pathname: '/dhcs/[id]',
                  query: { id: data.deviceId },
                }) }
              >
                <EntityBase.Content
                  truncation="constant"
                  fontWeight={ 700 }
                  text={ data.deviceId }
                  maxW="100%"
                  isLoading={ isLoading }
                />
              </EntityBase.Link>

              <DHCDeviceConnection
                ml={ 2 }
                time={ Number(data.lastHeartBeat ?? 0) }
              />
            </EntityBase.Container>
          );
        } else if (col.id === 'deviceStatus') {
          content = <DHCStatusTag status={ data.status } isLoading={ isLoading }/>;
        }

        return (
          <React.Fragment key={ col.id }>
            <ListItemMobileGrid.Label isLoading={ isLoading }>{ col.label }</ListItemMobileGrid.Label>
            <ListItemMobileGrid.Value>
              <Skeleton loading={ isLoading } display="inline-block" minW={ 10 }>
                { content }
              </Skeleton>
            </ListItemMobileGrid.Value>
          </React.Fragment>
        );
      }) }
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(DHCDeviceListItem);
