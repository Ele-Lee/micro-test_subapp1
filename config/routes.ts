import { CarOutlined } from '@ant-design/icons';

const routes: RoutesOptions[] = [
  {
    title: '子应用Aitem1',
    // entry_dev: '//localhost:8100',
    path: '/',
    icon: 'CarOutlined',
    children: [
      {
        title: '子菜单1',
        icon: 'CarOutlined',
        path: '/sub-item',
        // path: '/sub-item',
      },
      {
        title: '子菜单2',
        icon: 'CarOutlined',
        // path: '/sub-item2',
        path: '/sub-item2',
      },
      {
        title: 'aaa',
        path: '/aaaa',
      },
    ],
  },
];
interface RoutesOptions {
  title: string;
  name?: string;
  entry_dev?: string;
  path?: string;
  icon?: React.ReactNode;
  children?: RoutesOptions[];
}

export default routes;
