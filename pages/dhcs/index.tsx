import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const DHCs = dynamic(() => import('ui/pages/DHCs'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/dhcs">
      <DHCs/>
    </PageNextJs>
  );
};

export default Page;

export { validators as getServerSideProps } from 'nextjs/getServerSideProps/main';
