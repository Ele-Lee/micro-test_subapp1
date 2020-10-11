import React, { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import { IRouteComponentProps, MainAppModelState } from 'umi';
import LayoutMenu from '@/base_components/LayoutMenu';
import LayoutContent from '@/base_components/LayoutContent';
import { Layout } from 'antd';
// @ts-ignore
import { Link, connect } from 'umi';
import _omit from 'lodash/omit';
import { routes as routesConfig } from '../../config';

const { Content } = Layout;
const HeaderHeight = 60;

interface BaseLayoutProps extends IRouteComponentProps {
  routes: any[];
  apps: any[];
  menuLogo: string;
  menuTitle: string;
}

function BaseLayout({
  children,
  location,
  route,
  history,
  match,
  routes,
  apps = [],
  menuLogo = 'https://static.guorou.net/guorou-portal-logo.png',
  menuTitle = '果肉运营后台',
}: BaseLayoutProps) {
  const curPathname = location.pathname;
  const [menuItemKey, setMenuItemKey] = useState(curPathname);
  const [activeSubMenu, setActiveSubMenu] = useState<string | undefined>(
    undefined,
  );

  if (!menuItemKey) {
    throw Error('路由没有name 或者 path');
  }

  const isInMain = window !== undefined && !!window.__POWERED_BY_QIANKUN__;
  const isMainApp = window.__isMainApp__;

  const menuRoutes = useMemo(() => {
    if (!isMainApp) return routesConfig;
    const mergeIdxs: any[] = [];
    const _menuRoutes = apps.map(item => {
      const routesInfoFromSubIdx = routes.findIndex(
        item2 => item2.title === item.title,
      );
      let routesInfoFromSub = undefined;

      if (routesInfoFromSubIdx > -1) {
        mergeIdxs.push(routesInfoFromSubIdx);
        routesInfoFromSub = routes[routesInfoFromSubIdx];
      }
      return { ...item, ...routesInfoFromSub };
    });

    return [
      ...routes.filter((_, idx) => !mergeIdxs.includes(idx)),
      ..._menuRoutes,
    ];
  }, [apps, routes]);

  useEffect(() => {
    setActiveSubMenu(findActiveSubMenu(curPathname, menuRoutes));
  }, [curPathname, menuRoutes]);

  if (isInMain) {
    return children;
  }

  const contentWarp = useMemo(() => {
    if (!isMainApp && !isInMain) {
      return React.createElement('div', { children });
    }
    return apps.length
      ? React.createElement(LayoutContent, {
          appName: findNameByPath(menuItemKey, apps),
          children,
        })
      : null;
  }, [apps.length, menuItemKey]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {activeSubMenu && (
        <LayoutMenu
          logo={menuLogo}
          title={menuTitle}
          selectedKey={menuItemKey}
          HeaderHeight={HeaderHeight}
          activeSubMenu={activeSubMenu}
          menuItemList={(LayoutMenuItem, SubMenu) => {
            function renderItemByItem(routesArr: any[], pathPrefix = '/') {
              return routesArr.map(({ name, title, icon, path, children }) => {
                const menuProps = {
                  key: pathPrefix + (name || path),
                  icon: icon ? React.createElement(icon) : undefined,
                  title: title,
                };
                menuProps.key = menuProps.key.replace(/\/{2,}/g, '/');

                if (Array.isArray(children)) {
                  return (
                    <SubMenu {...menuProps}>
                      {renderItemByItem(children, menuProps.key)}
                    </SubMenu>
                  );
                }
                return (
                  <LayoutMenuItem {...menuProps}>
                    {title}
                    <Link to={menuProps.key}></Link>
                  </LayoutMenuItem>
                );
              });
            }
            return renderItemByItem(menuRoutes);
          }}
          onMenuClick={({ key }) => {
            let _key = String(key);
            setMenuItemKey(_key);
          }}
        />
      )}
      <Layout className="site-layout">
        <header className="b-c_fff" style={{ height: HeaderHeight }}>
          头
        </header>
        <Content
          className="site-layout-background b-c_fff"
          style={{
            margin: 16,
            height: '100%',
          }}
        >
          {contentWarp}
        </Content>
      </Layout>
    </Layout>
  );
}

function findNameByPath($path: string, $apps: any[]) {
  const appNameRegRes = $path.match(/^\/([\w-]+)\b/);
  if (!appNameRegRes) console.error('解析子应用名字出错');
  if (appNameRegRes) {
    const appName = appNameRegRes[1];
    const findRes = $apps.find(item => item.name === appName);
    if (findRes) {
      return findRes.name;
    }
  }
  // throw '解析子应用名字出错2';
  console.error('解析子应用名字出错2');
  return void 0;
}

function findActiveSubMenu(
  $pathname: string,
  $routesConfig: any[],
): string | undefined {
  if ($pathname === '/') return $pathname;
  let activeSubMenu: string | undefined = undefined;
  const pathnameRegRes = $pathname.match(/(\/[\w-]+)$/);
  if (!pathnameRegRes) throw '解析路由地址出错: ' + $pathname;
  for (const iterator of $routesConfig) {
    const { children, name, path, title } = iterator;

    if (
      Array.isArray(children) &&
      children.some(item => item.path === pathnameRegRes[1])
    ) {
      activeSubMenu = name ? '/' + name : path;
      break;
    }
    if ($pathname === `/${name}` || $pathname === path) {
      activeSubMenu = $pathname;
    }
  }

  return activeSubMenu;
}

const __connect = connect
  ? connect
  : (props: any) => {
      return (BaseComp: any) => {
        return BaseComp;
      };
    };

export default __connect(({ global }: { global: MainAppModelState }) => {
  return { routes: global.routes, apps: global.apps };
})(BaseLayout);
