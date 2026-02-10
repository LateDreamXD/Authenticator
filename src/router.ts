import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			redirect: '/2fa'
		},
		{
			path: '/2fa',
			name: '2fa',
			component: () => import('@/views/TwoFA.vue'),
		},
		{
			path: '/add/:type',
			name: 'add',
			component: () => import('@/views/Add.vue'),
		},
		{
			path: '/steam_guard',
			name: 'steam_guard',
			// component: () => import('@/views/SteamGuard.vue'),
			redirect: '/wip'
		},
		{
			path: '/passwords',
			name: 'passwords',
			// component: () => import('@/views/PasswordsMgr.vue'),
			redirect: '/wip'
		},
		{
			path: '/recovery_codes',
			name: 'recovery_codes',
			// component: () => import('@/views/RecoveryCodesMgr.vue'),
			redirect: '/wip'
		},
		{
			path: '/wip',
			name: 'wip',
			component: () => import('@/views/WIP.vue'),
		},
		{
			path: '/settings',
			name: 'settings',
			component: () => import('@/views/Settings.vue'),
		}
	],
});
