import React from 'react';

import Layout from './hoc/layout/layout';
import Chain from './containers/Chain/Chain';
import AdvancedBlock from './containers/AdvancedBlock/advancedBlock';

const app = () => {
  return (
    <Layout>
      <AdvancedBlock />
      <Chain />
    </Layout>
  );
}

export default app;
