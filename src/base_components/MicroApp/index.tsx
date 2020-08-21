import {
  FrameworkConfiguration,
  loadMicroApp,
  MicroApp as MicroAppType,
} from 'qiankun';
import React, { useEffect, useRef, useState, useMemo } from 'react';

import concat from 'lodash/concat';
import mergeWith from 'lodash/mergeWith';
import isFunction from 'lodash/isFunction';
import {
  BrowserHistoryBuildOptions,
  HashHistoryBuildOptions,
  MemoryHistoryBuildOptions,
} from 'history-with-query';

type HashHistory = {
  type?: 'hash';
} & HashHistoryBuildOptions;

type BrowserHistory = {
  type?: 'browser';
} & BrowserHistoryBuildOptions;

type MemoryHistory = {
  type?: 'memory';
} & MemoryHistoryBuildOptions;

type MicroDom = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type Props = {
  name: string;
  settings?: FrameworkConfiguration;
  base?: string;
  history?:
    | 'hash'
    | 'browser'
    | 'memory'
    | HashHistory
    | BrowserHistory
    | MemoryHistory;
  getMatchedBase?: () => string;
  loadingRenderCb?: (dom: MicroDom, l: boolean) => React.ReactNode;
} & Record<string, any>;

function unmountMicroApp(microApp?: MicroAppType) {
  if (microApp) {
    microApp.mountPromise.then(() => microApp.unmount());
  }
}

const my = async () => {
  // const { getMasterOptions } = await import(
  //   // @ts-ignore
  //   '@@/plugin-qiankun/masterOptions'
  // );
  return () => ({});
};

export default function MicroApp(componentProps: Props) {
  const {
    apps = [],
    lifeCycles: globalLifeCycles = {},
    ...globalSettings
  } = useMemo<any>(async () => {
    const isSlave = window !== undefined && window.__POWERED_BY_QIANKUN__;
    if (!isSlave) return {};
    return my()();
  }, []);

  const {
    name,
    settings: settingsFromProps = {},
    loadingRenderCb,
    lifeCycles = {},
    ...propsFromParams
  } = componentProps;

  const appConfig = apps.find((app: any) => app.name === name);
  if (!appConfig) {
    throw new Error(
      `[@umijs/plugin-qiankun]: Can not find the configuration of ${name} app!`,
    );
  }

  const { entry, props: propsFromConfig = {} } = appConfig;

  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    microAppRef.current = loadMicroApp(
      {
        name,
        entry,
        container: containerRef.current!,
        props: {
          ...propsFromConfig,
          ...propsFromParams,
        },
      },
      {
        ...globalSettings,
        ...settingsFromProps,
      },
      mergeWith(
        {},
        globalLifeCycles,
        {
          ...lifeCycles,
          afterMount: () => {
            setLoading(false);
            if (isFunction(lifeCycles.afterMount)) {
              lifeCycles.afterMount();
            }
          },
        },
        (v1, v2) => concat(v1 ?? [], v2 ?? []),
      ),
    );

    return () => {
      setLoading(true);
      unmountMicroApp(microAppRef.current);
    };
  }, [name]);

  const microAppRef = useRef<MicroAppType>();
  const updatingPromise = useRef<Promise<any>>();
  const updatingTimestamp = useRef(Date.now());

  useEffect(() => {
    const microApp = microAppRef.current;
    if (microApp) {
      if (!updatingPromise.current) {
        // 初始化 updatingPromise 为 microApp.mountPromise，从而确保后续更新是在应用 mount 完成之后
        updatingPromise.current = microApp.mountPromise;
      } else {
        // 确保 microApp.update 调用是跟组件状态变更顺序一致的，且后一个微应用更新必须等待前一个更新完成
        updatingPromise.current = updatingPromise.current.then(() => {
          const canUpdate = (microApp?: MicroAppType) =>
            microApp?.update && microApp.getStatus() === 'MOUNTED';
          if (canUpdate(microApp)) {
            const props = {
              ...propsFromConfig,
              ...propsFromParams,
              // setLoading,
            };

            if (process.env.NODE_ENV === 'development') {
              if (Date.now() - updatingTimestamp.current < 200) {
                console.warn(
                  `[@umijs/plugin-qiankun] It seems like microApp ${name} is updating too many times in a short time(200ms), you may need to do some optimization to avoid the unnecessary re-rendering.`,
                );
              }

              console.info(
                `[@umijs/plugin-qiankun] MicroApp ${name} is updating with props: `,
                props,
              );
              updatingTimestamp.current = Date.now();
            }

            // 返回 microApp.update 形成链式调用
            // @ts-ignore
            return microApp.update(props);
          }

          return void 0;
        });
      }
    }

    return () => {};
  }, Object.values({ ...propsFromParams }));

  return !!loadingRenderCb ? (
    <div>{loadingRenderCb(<div ref={containerRef} />, loading)}</div>
  ) : (
    <div ref={containerRef} />
  );
}
