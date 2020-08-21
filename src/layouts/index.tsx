import React, { useState, useEffect } from 'react';
import { IRouteComponentProps } from 'umi';
import LayoutMenu from '@/base_components/LayoutMenu';
import LayoutContent from '@/base_components/LayoutContent';
import { Layout } from 'antd';
import { Link } from 'umi';
import { routes as routesConfig } from '../../config';

const { Content } = Layout;
const HeaderHeight = 60;

export default function BaseLayout({
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) {
  const curPathname = location.pathname;

  const [menuItemKey, setMenuItemKey] = useState(curPathname);

  useEffect(() => {
    setMenuItemKey(curPathname);
  }, [curPathname]);

  if (!menuItemKey) {
    throw Error('路由没有name 或者 path');
  }

  const isInMain = window !== undefined && !!window.__POWERED_BY_QIANKUN__;

  if (isInMain) {
    return children;
  }

  const contentWarp = isInMain
    ? React.createElement(LayoutContent, { appName: menuItemKey })
    : React.createElement('div', { children });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <LayoutMenu
        logo="https://static.guorou.net/guorou-portal-logo.png"
        title="果肉运营后台"
        selectedKey={menuItemKey}
        HeaderHeight={HeaderHeight}
        activeSubMenu={findActiveSubMenu(curPathname, routesConfig)}
        onMenuClick={({ key }) => {
          setMenuItemKey(key as string);
        }}
        menuItemList={(LayoutMenuItem, SubMenu) => {
          function renderItemByItem(routesArr) {
            return routesArr.map(({ name, title, icon, path, children }) => {
              const menuProps = {
                key: name || path || title,
                icon: !icon ? undefined : React.createElement(icon),
                title: title,
              };
              if (Array.isArray(children)) {
                return (
                  <SubMenu {...menuProps}>{renderItemByItem(children)}</SubMenu>
                );
              }
              return (
                <LayoutMenuItem {...menuProps}>
                  {title}
                  {!!path && <Link to={path}></Link>}
                </LayoutMenuItem>
              );
            });
          }
          return renderItemByItem(routesConfig);
        }}
      />
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
          {/* {isInMain ? <LayoutContent appName={menuItemKey} /> : children} */}
          {contentWarp}
        </Content>
      </Layout>
    </Layout>
  );
}

function findActiveSubMenu(
  $pathname: string,
  $routesConfig: any[],
): string | undefined {
  let activeSubMenu: string | undefined = undefined;

  for (const iterator of $routesConfig) {
    const { children, name, path, title } = iterator;
    if (
      Array.isArray(children) &&
      children.some(item => item.path === $pathname)
    ) {
      activeSubMenu = name || path || title;
      break;
    }
  }

  return activeSubMenu;
}
