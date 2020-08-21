import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
// import '@assets/style/index.less';
import { routes } from '../config';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import MicroStorage from '@grfe/micro-store/src';

if (window.__POWERED_BY_QIANKUN__) {
  const ss = new MicroStorage({ state: {}, name: 'subapp1' });
  ss.set('MAIN_APP/routes/subapp1', routes);
}

export function rootContainer(container: React.ReactNode) {
  return <ConfigProvider locale={zhCN}>{container}</ConfigProvider>;
}
