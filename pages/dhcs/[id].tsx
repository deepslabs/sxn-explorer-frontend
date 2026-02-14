import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps/handlers';
import PageNextJs from 'nextjs/PageNextJs';

const DHC = dynamic(() => import('ui/pages/DHC'), { ssr: false });

const Page: NextPage<Props> = (props) => {
  return (
    <PageNextJs pathname="/dhcs/[id]" query={ props.query }>
      <DHC/>
    </PageNextJs>
  );
};

export default Page;

export { validatorDetails as getServerSideProps } from 'nextjs/getServerSideProps/main';
