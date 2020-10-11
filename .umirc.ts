import { defineConfig } from 'umi';
// @ts-ignore
import getSymlinks from 'get-symlinks';
import * as fs from 'fs';
import pkg from './package.json';
import { routes as routesConfig } from './config';

export default defineConfig({
  base: '/' + pkg.name,
  publicPath: '/' + pkg.name + '/',
  // layout: {},
  dva: {},
  qiankun: {
    slave: {},
  },
  nodeModulesTransform: {
    type: 'none',
  },
  mlayout: {
    subname: 'subapp1',
    menuConfig: routesConfig,
  },
  plugins: ['../../../micro-layout/lib'],
  // plugins: ['@grfe/micro-layout'],
  // routes: [{ path: '/', component: '@/pages/index' }],
  chainWebpack: (config, { webpack }) => {
    let symlinks = getSymlinks.sync(['./node_modules/**'], {
      onlyDirectories: true,
      deep: 1,
    });
    symlinks.forEach((path: string) => {
      let _path = fs.realpathSync(path);
      config.module.rule('ts-in-node_modules').include.add(_path);
    });
  },
  externals: {
    '@grfe/micro-store': '@grfe/micro-store',
    'micro-layout': 'micro-layout',
    '../../../micro-layout/lib': '../../../micro-layout/lib',
  },
  headScripts: [
    {
      src: 'https://static.guorou.net/lib/micro_store@0.0.1-beta2.js',
      ingore: true,
    },
  ],
});
