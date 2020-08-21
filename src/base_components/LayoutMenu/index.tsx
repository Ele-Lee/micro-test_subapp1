import React, { useState, useEffect } from 'react';
import styled, { css, StyledComponent } from 'styled-components';
import { Menu, Layout } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface LayoutMenuProps {
  menuItemList: (
    item: StyledComponent<typeof MenuItem, any, {}, never>,
    subMenu: typeof SubMenu,
  ) => React.ReactNode[];
  logo: string;
  title: string;
  selectedKey: string;
  activeSubMenu?: string;
  onMenuClick: MenuClickEventHandler;
  HeaderHeight: number;
}

const localKey = '__menu_collapsed__';

const LayoutMenu: React.FC<LayoutMenuProps> = ({
  menuItemList,
  logo,
  title,
  selectedKey,
  onMenuClick,
  HeaderHeight,
  activeSubMenu,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(
    () => window.localStorage.getItem(localKey) == '1',
  );
  useEffect(() => {
    window.localStorage.setItem(localKey, collapsed ? '1' : '0');
  }, [collapsed]);
  const onCollapse = () => setCollapsed(!+collapsed);

  return (
    <ResetSider width={160} {...{ collapsed, onCollapse }} collapsible>
      {logo && (
        <LogoWrap style={{ height: HeaderHeight }}>
          <Logo>
            <img src={logo} alt="" />
            {!collapsed && <span>{title}</span>}
          </Logo>
        </LogoWrap>
      )}
      <ResetMenu
        mode="inline"
        theme="dark"
        // inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        onClick={onMenuClick}
        defaultOpenKeys={activeSubMenu ? [activeSubMenu] : undefined}
      >
        {menuItemList(LayoutMenuItem, SubMenu)}
      </ResetMenu>
    </ResetSider>
  );
};

const css_flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResetSider = styled(Sider)``;

const ResetMenu = styled(Menu)``;

const LayoutMenuItem = styled(Menu.Item)`
  width: 100%;
  text-align: center;
  padding: 0 !important;
  margin: 8px 0 !important;
`;
const LogoWrap = styled.section`
  ${css_flexCenter}
`;

const Logo = styled.section`
  ${css_flexCenter}
  box-sizing: border-box;
  /* margin: 8px auto; */
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  img {
    margin: 4px;
    height: 32px;
    width: 32px;
    border-radius: 50%;
  }
  span {
    white-space: nowrap;
    animation: fadeInRight 0.4s;
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
      }

      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
  }
`;

export default LayoutMenu;
