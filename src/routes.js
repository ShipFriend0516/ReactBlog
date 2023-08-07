import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import ListPage from './pages/ListPage';
import ShowPage from './pages/ShowPage';
import AdminPage from './pages/AdminPage';

const routes = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/blogs',
    component: ListPage
  },
  {
    path: '/blogs/create',
    component: CreatePage
  },
  {
    path: '/blogs/:id/edit',
    component: EditPage
  },
  {
    path: '/blogs/:id',
    component: ShowPage
  },
  {
    path: '/admin',
    component: AdminPage
  }
]

export default routes