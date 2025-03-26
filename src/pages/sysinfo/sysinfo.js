import React, { useEffect, useState } from 'react';
import { CustomDataTable, TableFilter } from '@bento-core/data-table';
import { getColumns } from '@bento-core/util';
import { makeStyles, Grid } from '@material-ui/core';
import env from '../../utils/env';
import { dependencyRequirements } from '../../bento/sysinfoData';
import bentoCorePackageJson from '../../../node_modules/@bento-core/all/package.json';


const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
});

function createRow(key, value) {
  return { key, value };
}

const coreServiceOptions = {
  columns: [
    {
      dataField: 'key',
      header: 'Name',
    },
    {
      dataField: 'value',
      header: 'Current Version',
    },
  ],
};

const microservicesOptions = {
  columns: [
    {
      dataField: 'key',
      header: 'Name',
    },
    {
      dataField: 'value',
      header: 'Version',
    },
  ],
};

const environmentVariableOptions = {
  columns: [
    {
      dataField: 'key',
      header: 'Variable',
    },
    {
      dataField: 'value',
      header: 'Value',
    },
  ],
};

const dependenciesOptions = {
  columns: [
    {
      dataField: 'key',
      header: 'Name',
    },
    {
      dataField: 'value',
      header: 'Current Version',
    },
  ],
};

const SysInfo = () => {
  const classes = useStyles();

  const frontendVersion = env.REACT_APP_FRONTEND_VERSION;
  const backendVersion = env.REACT_APP_BACKEND_VERSION;
  const fileServiceVersion = env.REACT_APP_FILE_SERVICE_VERSION;
  const authVersion = env.REACT_APP_AUTH_SERVICE_VERSION;
  const interopVersion = env.REACT_APP_INTEROP_SERVICE_VERSION;

  const authApiEndpoint = env.REACT_APP_AUTH_SERVICE_API;
  const backendApiEndpoint = env.REACT_APP_BACKEND_API;
  const fileServiceApiEndpoint = env.REACT_APP_FILE_SERVICE_API;
  const interopApiEndpoint = env.REACT_APP_INTEROP_SERVICE_URL;

  const coreServicesData = [
    createRow('Frontend version', frontendVersion),
    createRow('Backend version', backendVersion),
    createRow('Bento core', bentoCorePackageJson.version),
  ];

  const microservicesData = [
    createRow('File service version', fileServiceVersion),
    createRow('Auth version', authVersion),
    createRow('Interoperation API version', interopVersion),
  ];

  const environmentVariablesData = [
    createRow('Backend API endpoint', backendApiEndpoint),
    createRow('File Service API endpoint', fileServiceApiEndpoint),
    createRow('Auth API endpoint', authApiEndpoint),
    createRow('Interoperation API endpoint', interopApiEndpoint),
  ];

  const dependenciesData = [
    createRow('Node', dependencyRequirements.node),
    createRow('NPM', dependencyRequirements.npm),
  ];

  return (
    <>
      <Grid item xs={12} id="table_core">
        <CustomDataTable
          options={{
            selectableRows: 'none',
          }}
          title="Core"
          data={coreServicesData}
          columns={getColumns(coreServiceOptions, classes)}
        />
      </Grid>
      <Grid item xs={12} id="table_micro">
        <CustomDataTable
          options={{
            selectableRows: 'none',
          }}
          title="Micro Services"
          data={microservicesData}
          columns={getColumns(microservicesOptions, classes)}
        />
      </Grid>
      <Grid item xs={12} id="table_env">
        <CustomDataTable
          options={{
            selectableRows: 'none',
          }}
          title="Environment Variables"
          data={environmentVariablesData}
          columns={getColumns(environmentVariableOptions, classes)}
        />
      </Grid>
      <Grid item xs={12} id="table_file">
        <CustomDataTable
          options={{
            selectableRows: 'none',
          }}
          title="Dependencies"
          data={dependenciesData}
          columns={getColumns(dependenciesOptions, classes)}
        />
      </Grid>
    </>
  );
};

export default SysInfo;
