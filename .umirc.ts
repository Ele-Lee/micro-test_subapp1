import { defineConfig } from 'umi';
// @ts-ignore
import getSymlinks from 'get-symlinks';
import * as fs from 'fs';

export default defineConfig({
  layout: false,
  dva: {},
  qiankun: {
    slave: {},
  },
  nodeModulesTransform: {
    type: 'none',
  },
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
  },
  headScripts: [
    {
      src: 'https://static.guorou.net/lib/micro_store@0.0.1-beta2.js',
      ingore: true,
    },
  ],
});
