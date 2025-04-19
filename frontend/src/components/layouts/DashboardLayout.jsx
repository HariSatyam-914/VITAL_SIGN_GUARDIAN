import React from 'react';
import Layout from '../layout/Layout';

/**
 * DashboardLayout component
 * Wrapper around the main Layout component for dashboard pages
 */
const DashboardLayout = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default DashboardLayout;