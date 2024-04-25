import { Theme, createTheme } from '@mui/material/styles';
import axios, { AxiosResponse } from 'axios';

import { IPlugin } from './types';
import config from './config';

const makeUrl = (name: string) => `${config.schemaEndpoint}/plugin/${config.version}/${name}`;
const extractJson = async (response: AxiosResponse<any, any>) => response.data;
const axioHeaders = { 'Content-Type': 'application/json' };
const jsonToPlugin = (json: any): IPlugin => ({
  name: json.name,
  ui: json.ui,
  schema: json.schema,
});

const loadRemotePlugin = async (name: string): Promise<IPlugin> =>
  axios.get(makeUrl(name), { headers: axioHeaders }).then(extractJson).then(jsonToPlugin);

export const loadPlugin = loadRemotePlugin;

export const getTheme = ({ ui }: IPlugin): Theme => createTheme(ui.themeOptions);
