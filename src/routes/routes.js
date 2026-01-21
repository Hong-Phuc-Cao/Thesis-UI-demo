import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/auth/login.vue';
import GiaoVienBoMon from '../layouts/giao-vien-bo-mon.layout.vue';
import HieuTruong from '../layouts/hieu-truong.layout.vue';
import HieuPho from '../layouts/hieu-pho.layout.vue';
import ToTruong from '../layouts/to-truong.layout.vue';
import Admin from '../layouts/admin.layout.vue';
import ChonVaiTro from '../views/giao-vien-bo-mon/chon-vai-tro.vue';

const routes = [
    {
        path: '/',
        redirect: ()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.roles) {
            return getDefaultPath(user.roles);
        }
        return '/login';            
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { requiresAuth: false },
    },
    {
        path: '/giao-vien-bo-mon',
        name: 'giao-vien-bo-mon',
        component: GiaoVienBoMon,
        meta: { requiresAuth: true, requiresRole: ['GIAO_VIEN'] },
        children: [
            {
                path: 'thong-tin-ca-nhan',
                name: 'thong-tin-ca-nhan',
                component: () => import('../views/giao-vien-bo-mon/thong-tin-ca-nhan.vue'),
            },
            {
                path: 'sua-mat-khau',
                component: () => import('../views/giao-vien-bo-mon/sua-mat-khau.vue'),
            },
            {
                path: 'xem-phan-cong',
                name: 'xem-phan-cong',
                component: () => import('../views/giao-vien-bo-mon/xem-phan-cong.vue'),
            },
            {
                path: 'chon-vai-tro',
                name: 'chon-vai-tro',
                component: ChonVaiTro,
            },
        ],
    },
    {
        path: '/hieu-truong',
        name: 'hieu-truong',
        component: HieuTruong,
        meta: { requiresAuth: true, requiresRole: ['HIEU_TRUONG'] },
        children: [
            {
                path: 'xem-phan-cong-chuyen-mon',
                component: () => import('../views/hieu-truong/xem-phan-cong-chuyen-mon.vue'),
            },
            {
                path: 'xem-thong-ke',
                component: () => import('../views/hieu-truong/xem-thong-ke.vue'),
            },
        ],
    },
    {
        path: '/hieu-pho',
        name: 'hieu-pho',
        component: HieuPho,
        meta: { requiresAuth: true, requiresRole: ['HIEU_PHO'] },
        children: [
            {
                path: 'kiem-nhiem',
                component: () => import('../views/hieu-pho/kiem-nhiem.vue'),
            },
            {
                path: 'giu-chuc-vu',
                component: () => import('../views/hieu-pho/giu-chuc-vu.vue'),
            },
            {
                path: 'chuong-trinh',
                component: () => import('../views/hieu-pho/chuong-trinh.vue'),
            },
            {
                path: 'phan-cong-hieu-pho',
                component: () => import('../views/hieu-pho/phan-cong-hieu-pho.vue'),
            },
        ],
    },
    {
        path: '/to-truong',
        name: 'to-truong',
        component: ToTruong,
        meta: { requiresAuth: true, requiresRole: ['TO_TRUONG'] },
        children: [
            {
                path: 'phan-cong-chuyen-mon',
                component: () => import('../views/to-truong/phan-cong-chuyen-mon.vue'),
            },
        ],
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        meta: { requiresAuth: true, requiresRole: ['ADMIN'] },
        children: [
            {
                path: 'giao-vien',
                name: 'giao-vien',
                component: () => import('../views/admin/giao-vien.vue'),
            },
            {
                path: 'tai-khoan',
                name: 'tai-khoan',
                component: () => import('../views/admin/tai-khoan.vue'),
            },
            {
                path: 'chuc-vu',
                name: 'chuc-vu',
                component: () => import('../views/admin/chuc-vu.vue'),
            },
            {
                path: 'nhiem-vu',
                name: 'nhiem-vu',
                component: () => import('../views/admin/nhiem-vu.vue'),
            },
            {
                path: 'mon-hoc',
                name: 'mon-hoc',
                component: () => import('../views/admin/mon-hoc.vue'),
            },
            {
                path: 'nhom-mon-hoc',
                component: () => import('../views/admin/nhom-mon-hoc.vue'),
            },
            {
                path: 'lop',
                component: () => import('../views/admin/lop.vue'),
            },
            {
                path: 'nam-hoc',
                name: 'nam-hoc',
                component: () => import('../views/admin/nam-hoc.vue'),
            },
            {
                path: 'hoc-ky',
                name: 'hoc-ky',
                component: () => import('../views/admin/hoc-ky.vue'),
            },
            {
                path: 'to-bo-mon',
                name: 'to-bo-mon',
                component: () => import('../views/admin/to-bo-mon.vue'),
            },
            {
                path: 'quyen',
                component: () => import('../views/admin/quyen.vue'),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
    return null;
    }
};

const getDefaultPath = (roles) => {
  if (!roles || !Array.isArray(roles)) return '/login';
  if (roles.includes('ADMIN')) return '/admin';
  if (roles.includes('HIEU_TRUONG')) return '/hieu-truong';
  if (roles.includes('HIEU_PHO')) return '/hieu-pho';
  if (roles.includes('TO_TRUONG')) return '/to-truong';
  return '/giao-vien-bo-mon/thong-tin-ca-nhan'; // default for GIAO_VIEN
};

router.beforeEach((to, from, next) => {
  const user = getUser();

  // Allow access to public routes (only login)
  if (!to.meta.requiresAuth) {
    if (user && to.path === '/login') {
      // Already logged in → go to their dashboard
      next(getDefaultPath(user.roles));
    } else {
      next();
    }
    return;
  }

  // Protected route: must be logged in
  if (!user) {
    next('/login');
    return;
  }

  // Check if user has permission for this route
  if (to.meta.allowedRoles) {
    const hasAccess = to.meta.allowedRoles.some(role => user.roles.includes(role));
    if (hasAccess) {
      next();
    } else {
      // No access → redirect to their default page
      next(getDefaultPath(user.roles));
    }
  } else {
    next(); 
  }
});


export default router;