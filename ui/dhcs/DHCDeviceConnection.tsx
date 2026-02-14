import type { HTMLChakraProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';

interface Props extends Omit<HTMLChakraProps<'p'>, 'children'> {
  time: number;
}

const DHCDeviceConnection = ({ time, ...style }: Props) => {
  const textColor = React.useMemo(() => {
    if (!time) {
      return 'text.secondary';
    }

    const diff = dayjs().diff(dayjs(time), 'minute');
    if (diff < 10) {
      return 'green.500';
    }
    if (diff < 20) {
      return 'orange.400';
    }

    return 'red.500';
  }, [ time ]);

  const text = React.useMemo(() => {
    if (!time) {
      return 'N/A';
    }

    return dayjs(time).fromNow();
  }, [ time ]);

  return (
    <Text color={ textColor } fontSize="sm" fontWeight={ 500 } { ...style }>
      { text }
    </Text>
  );
};

export default React.memo(DHCDeviceConnection);
