import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
// import '@assets/style/index.less';
import { routes } from '../config';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import MicroStorage from '@grfe/micro-store';

export function rootContainer(container: React.ReactNode) {
  return <ConfigProvider locale={zhCN}>{container}</ConfigProvider>;
}
export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {},
  // 应用 render 之前触发
  async mount(props) {},
  // 应用卸载之后触发
  async unmount(props) {},
};
