import React from 'react';

import Layout from './hoc/layout/layout';
import Chain from './containers/Chain';

const app = () => {
  return (
    <Layout>
      <Chain></Chain>
    </Layout>
  );
}

export default app;
