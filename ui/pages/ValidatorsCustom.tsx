import React from 'react';

import PageTitle from 'ui/shared/Page/PageTitle';
import ValidatorsTable from 'ui/validators/custom/ValidatorsTable';
import ValidatorStats from 'ui/validators/custom/ValidatorStats';

const ValidatorsCustom: React.FC = () => {
  return (
    <>
      <PageTitle title="Validators" withTextAd/>
      <ValidatorStats/>
      <ValidatorsTable/>
    </>
  );
};

export default ValidatorsCustom;
