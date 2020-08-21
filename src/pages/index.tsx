import React, { useEffect } from 'react';
import styles from './index.less';
import MicroStorage from '@grfe/micro-store';
import { Input } from 'antd';

const Home = props => {
  useEffect(() => {
    const state = {
      subapp1Data: 44,
      obj: { a: 1 },
      aa: 'sf',
    };
    const ss = new MicroStorage({ state, name: 'subapp1' });

    ss.watch('subapp1Data', (v, v2) => {
      console.log(
        '%celelee test:',
        'background:#000;color:#1ff',
        '变化',
        v,
        v2,
      );
    });
    ss.watch('subapp1/obj/a', (v, v2) => {
      console.log(
        '%celelee test:',
        'background:#000;color:#11f',
        '变化',
        v,
        v2,
      );
    });
    // ss.set('subapp1/obj/a', 22);
    // ss.watch('subapp1', 'subapp1Data', (v, v2) => {
    //   console.log(
    //     '%celelee test:',
    //     'background:#000;color:#1ff',
    //     '变化',
    //     v,
    //     v2,
    //   );
    // });
    // ss.set('subapp1Data', 1);
    // setTimeout(() => {
    //   ss.set('subapp1Data', 2);
    // }, 1000);
    // console.log(
    //   '%celelee test:',
    //   'background:#000;color:#fff',
    //   window['__micro_conntent_storage__'],
    //   ss.get('subapp1/obj/a'),
    // );
  }, []);
  return (
    <div>
      <h1 className={styles.title}>subapp1 Page index</h1>
      <Input />
    </div>
  );
};
export default Home;
