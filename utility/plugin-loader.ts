const axios = require('axios');
import { once } from 'lodash';
import dbgPlugin from './dbg-plugin.json';
const version = 'EVLOCKER-0.0.3';

const fetchFromGithub = (GITHUB_TOKEN: string) => (version: string) => async (name: string) => {
  switch (name) {
    case 'devapp':
      return dbgPlugin;
    case 'simpledemo':
      return dummyPlugin;
    default:
      break;
  }

  const owner = `Carbon-Mint`;
  const scheme = 'evlocker';
  const repository = `event-schemas`;
  const githubTag = !version || version == 'default' ? getDefaultVersion() : version;

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${GITHUB_TOKEN}`,
  };
  const url = `https://raw.githubusercontent.com/${owner}/${repository}/${githubTag}/${scheme}/${name}.json`;

  console.log('HTTP request', url, headers);
  const response = await axios.get(url, { headers });
  return response.data;
};

const getDefaultVersion = () => process.env.CM_SCHEMA_VERSION;

import { IPlugin } from '../plugins/types';

const fetcher = fetchFromGithub(process.env.GITHUB_TOKEN || 'NO_GITHUB_TOKEN_AVAILABLE')(version);

export const fetchPlugin = async (name: string): Promise<IPlugin> => fetcher(name);

const dummyPlugin = {
  name: 'lint',
  ui: {
    themeOptions: {
      palette: {
        primary: {
          main: '#1199bb',
        },
        secondary: {
          main: '#005aff',
        },
        error: {
          main: '#ff1744',
        },
      },
    },
    uiSchema: {
      testReport: {
        // "ui:widget": "drag-n-drop",
        'ui:widget': 'FileWidget',
        'ui:options': {
          accept: 'application/pdf',
          // "accept": "./pdf",
          multiple: false,
        },
      },
    },
  },
  schema: {
    $id: '@carbonmint/lint-ngmo-schema',
    $ref: '#/definitions/Record',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'DevApp',
    definitions: {
      Record: {
        properties: {
          originReference: {
            description: 'Origin reference number for a sample',
            type: 'string',
            default: 'sample-1234',
          },
          labReference: {
            description: 'Origin reference number for a sample',
            type: 'string',
            default: 'lab-5678',
          },
          testReport: {
            description: 'Test report document',
            type: 'string',
            format: 'data-url',
          },
        },
        required: ['originReference', 'labReference', 'testReport'],
        type: 'object',
      },
    },
  },
};
