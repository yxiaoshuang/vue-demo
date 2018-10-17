import Login from './views/Login.vue';
import NotFound from './views/404.vue';
import Home from './views/Home.vue';
import Main from './views/Main.vue';
import myProject from './views/nav2/myProject.vue';
import taskTime from './views/nav2/taskTime.vue';
import taskTimeDetail from './views/nav2/taskTimeDetail.vue';

import userAdmin from './views/admin/user.vue';
import userDetail from './views/admin/userDetail.vue';
import projectAdmin from './views/admin/project.vue';
import projectDetail from './views/admin/projectDetail.vue';
import demandDetail from './views/admin/demandDetail.vue';
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export default new Router({
	routes:[
		{
			path: '/login',
			component: Login,
			name: 'login',
			hidden: true,
		},
		{
			path: '/404',
			component: NotFound,
			name: '',
			hidden: true,
		},
		//{ path: '/main', component: Main },
		{
			path: '/',
			component: Home,
			hidden: true,
			name: '基础管理',
			code: 'system_manage',
			iconCls: 'el-icon-message', //图标样式class
			children: [
				{ path: '/main', component: Main, name: '主页', hidden: true, title: '主页', code: '' },
				{ path: '/project', component: projectAdmin, name: '项目管理', code: 'project_manage', hidden: true },
				{ path: '/user', component: userAdmin, name: '人员管理', code: 'user_manage', hidden: true },
				//{ path: '/user', component: userAdmin, name: '权限管理',code:'user_manage' },
				{
					path: '/admin/userDetail/:userNumber',
					component: userDetail,
					name: 'userDetail',
					hidden: true,
					title: '人员详情',
					code: 'user_detail',
				},
				{
					path: '/admin/projectDetail/:projectNumber',
					component: projectDetail,
					name: '项目详情',
					hidden: true,
					code: 'user_detail',
				},
				{
					path: '/admin/demandDetail/:demandNumber',
					component: demandDetail,
					name: '需求详情',
					hidden: true,
					code: 'demand_detail',
				},
			],
		},
		{
			path: '/',
			component: Home,
			name: '过程管理',
			hidden: true,
			iconCls: 'fa fa-id-card-o',
			code: 'process_manage',
			children: [
				//{ path: '/myProject', component: myProject, name: '我负责的项目' },
				{ path: '/taskTime', component: taskTime, name: '工时填报', code: 'task_manage', hidden: true },
				{
					path: '/nav2/taskTimeDetail/:proTimeWeek',
					component: taskTimeDetail,
					name: '工时详情',
					hidden: true,
					code: 'task_detail',
				},
			],
		},
		//{
		//	path: '/',
		//	component: Home,
		//	name: 'Charts',
		//	iconCls: 'fa fa-bar-chart',
		//	children: [{ path: '/echarts', component: echarts, name: 'echarts' }],
		//},
		{
			path: '*',
			hidden: true,
			redirect: { path: '/404' },
		},
	],
});
