import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from '@/pages/DashboardPage.vue';
import InvestmentsPage from '@/pages/InvestmentsPage.vue';
import LandingPage from '@/pages/LandingPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: '/', name: 'landing', component: LandingPage, meta: { public: true } },
  { path: '/login', name: 'login', component: LoginPage, meta: { public: true, authOnly: true } },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { public: true, authOnly: true },
  },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage },
  { path: '/investments', name: 'investments', component: InvestmentsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.isLoading) {
    await auth.hydrate();
  }

  if (!to.meta.public && !auth.user) {
    return { name: 'login' };
  }

  if (to.meta.authOnly && auth.user) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
