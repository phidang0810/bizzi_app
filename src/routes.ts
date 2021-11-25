import { PageAccessDenied } from './PageAccessDenied';
import { LoginPage } from './pages/login';
import { PostDetailPage } from './pages/detail';
import { PostListPage } from './pages/list';
import { ManagePostListPage } from './pages/manage-post/index';
import { ManagePostDetailPage } from './pages/manage-post/edit';
import { ManageAddPostPage } from './pages/manage-post/add';
import { PageNotFound } from './PageNotFound';
export default [
    {
        path: `/`,
        exact: true,
        auth: false,
        component: PostListPage
    },
    {
        path: `/not-found`,
        exact: true,
        auth: false,
        component: PageNotFound
    },
    {
        path: `/access-denied`,
        exact: true,
        auth: false,
        component: PageAccessDenied
    },
    {
        path: `/login`,
        exact: true,
        auth: false,
        component: LoginPage
    },    
    {
        path: `/manage-post`,
        exact: true,
        auth: true,
        component: ManagePostListPage
    },    
    {
        path: `/manage-post/add`,
        exact: true,
        auth: true,
        component: ManageAddPostPage
    },
    {
        path: `/manage-post/:id`,
        exact: true,
        auth: true,
        component: ManagePostDetailPage
    },
    {
        path: `/:slug/:id`,
        exact: true,
        auth: false,
        component: PostDetailPage
    },
]