<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item @click.native="uptPwd">修改密码</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect" unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in menuList" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title">
								<i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
							<i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>

		<el-dialog title="修改密码" v-model="uptPwdDialogVisible">
			<el-form v-model="pwdForm">
				<el-form-item label="原始密码" :label-width="formLabelWidth">
					<el-input v-model="pwdForm.oldPwd" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="新密码" :label-width="formLabelWidth">
					<el-input v-model="pwdForm.uptPwd" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="重复新密码" :label-width="formLabelWidth">
					<el-input v-model="pwdForm.rptPwd" auto-complete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="uptPwdDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updatePwd">确 定</el-button>
			</div>
		</el-dialog>
	</el-row>

</template>

<script>
import sysUserAvatar from '../assets/img/adam.jpg';
export default {
	data() {
		return {
			sysName: '工时管理系统',
			collapsed: false,
			sysUserName: '',
			sysUserAvatar: sysUserAvatar,
			uptPwdDialogVisible: false,
			pwdForm: {},
			formLabelWidth: '100',
			form: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: '',
			},
			menuList: [],
		};
	},
	methods: {
		onSubmit() {
			console.log('submit!');
		},
		handleopen() {
			//console.log('handleopen');
		},
		handleclose() {
			//console.log('handleclose');
		},
		handleselect: function(a, b) {},
		uptPwd: function() {
			var _this = this;
			_this.uptPwdDialogVisible = true;
		},
		updatePwd() {
			var _this = this;

			_this.pwdForm.uid = JSON.parse(sessionStorage.getItem('user')).id;
			_this
				.postRequest('/user/uptPassword', _this.pwdForm)
				.then(function(resp) {
					if (resp && resp.status == 200 && resp.data.code == 0 && resp.data.data == 1) {
						_this.$message({
							message: '密码修改成功',
							type: 'success',
						});
						_this.pwdForm = {};
						_this.uptPwdDialogVisible = false;
					} else {
						_this.$message({
							message: resp.data.message,
							type: 'error',
						});
					}
				})
				.catch(function() {
					_this.logining = false;
					_this.$message({
						message: '密码修改失败',
						type: 'error',
					});
				});
		},
		//退出登录
		logout: function() {
			var _this = this;
			this.$confirm('确认退出吗?', '提示', {
				//type: 'warning'
			})
				.then(function() {
					// _this.getRequest('/user/logOut').then(function(res) {
					// 	console.log(res);
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
					// })
					// .catch(function(err) {
					// 	console.log(err);
					// });
				})
				.catch(function() {});
		},
		//折叠导航栏
		collapse: function() {
			this.collapsed = !this.collapsed;
		},
		showMenu(i, status) {
			this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status
				? 'block'
				: 'none';
		},
	},
	mounted() {
		var that = this;
		var user = sessionStorage.getItem('user');

		if (user) {
			user = JSON.parse(user);
			that.sysUserName = user.data.realname || '';
			that.sysUserAvatar = user.data.avatar || sysUserAvatar;
			that
				.getRequest('/sys/user/getAuthUrl?uid=' + user.data.id + '&type=')
				.then(function(res) {
					if (res.data.code == 0 && res && res.status == 200) {
						for (var i = 0; i < res.data.data.length; i++) {
							let list = res.data.data[i];
							for (var k = 0; k < that.$router.options.routes.length; k++) {
								let item = that.$router.options.routes[k];
								if (item.code == list.code) {
									that.$set(item, 'hidden', false);
								}
								if (item.code == list.parent_code) {
									for (var l = 0; l < item.children.length; l++) {
										let subPro = item.children[l];
										if (subPro.code == list.code) {
											that.$set(subPro, 'hidden', false);
										}
									}
								}
							}
						}
					}
					that.menuList = that.$router.options.routes;
				})
				.catch(function(err) {
					console.log(err);
				});
		}
	},
};
</script>

<style scoped lang="scss">
@import '~scss_vars';

.container {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	.header {
		height: 60px;
		line-height: 60px;
		background: $color-primary;
		color: #fff;
		.userinfo {
			text-align: right;
			padding-right: 35px;
			float: right;
			.userinfo-inner {
				cursor: pointer;
				color: #fff;
				img {
					width: 40px;
					height: 40px;
					border-radius: 20px;
					margin: 5px 0px 10px 10px;
					float: right;
				}
			}
		}
		.logo {
			//width:230px;
			height: 60px;
			font-size: 22px;
			padding-left: 20px;
			padding-right: 20px;
			border-color: rgba(238, 241, 146, 0.3);
			border-right-width: 1px;
			border-right-style: solid;
			img {
				width: 40px;
				float: left;
				margin: 10px 10px 10px 18px;
			}
			.txt {
				color: #fff;
			}
		}
		.logo-width {
			width: 230px;
		}
		.logo-collapse-width {
			width: 60px;
		}
		.tools {
			padding: 0px 23px;
			width: 14px;
			height: 60px;
			line-height: 60px;
			cursor: pointer;
		}
	}
	.main {
		display: flex;
		// background: #324057;
		position: absolute;
		top: 60px;
		bottom: 0px;
		overflow: hidden;
		aside {
			flex: 0 0 230px;
			width: 230px;
			// position: absolute;
			// top: 0px;
			// bottom: 0px;
			.el-menu {
				height: 100%;
			}
			.collapsed {
				width: 60px;
				.item {
					position: relative;
				}
				.submenu {
					position: absolute;
					top: 0px;
					left: 60px;
					z-index: 99999;
					height: auto;
					display: none;
				}
			}
		}
		.menu-collapsed {
			flex: 0 0 60px;
			width: 60px;
		}
		.menu-expanded {
			flex: 0 0 230px;
			width: 230px;
		}
		.content-container {
			// background: #f1f2f7;
			flex: 1;
			// position: absolute;
			// right: 0px;
			// top: 0px;
			// bottom: 0px;
			// left: 230px;
			overflow-y: scroll;
			padding: 20px;
			.breadcrumb-container {
				//margin-bottom: 15px;
				.title {
					width: 200px;
					float: left;
					color: #475669;
				}
				.breadcrumb-inner {
					float: right;
				}
			}
			.content-wrapper {
				background-color: #fff;
				box-sizing: border-box;
			}
		}
	}
}
</style>