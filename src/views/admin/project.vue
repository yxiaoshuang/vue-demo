<template>
	<div class="index1">
		<!-- 条件查询 -->
		<el-row align="middle" :gutter="20" type="flex">
			<el-col :span="8">
				<el-button class="add_btn" @click="dialogFormVisible = true">添加</el-button>
			</el-col>
		</el-row>
		<div>
			<!-- 列表 -->
			<el-table :data="pageData" border stripe style="width:100%;">
				<el-table-column prop="number" label="项目编号"></el-table-column>
				<el-table-column prop="name" label="项目名称"></el-table-column>
				<el-table-column prop="username" label="项目经理"></el-table-column>
				<el-table-column prop="status" label="状态"></el-table-column>
				<el-table-column prop="endtime" label="项目结束日期"></el-table-column>
				<el-table-column operation="操作" label="操作" min-width="200">
					<template slot-scope="scope">
						<el-button size="small" @click="modify(scope.$index, scope.row)">编辑 </el-button>
						<el-button size="small" @click="onClick(scope.row)">详情</el-button>
						<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-row :gutter="20">
				<el-col :span="12" :offset="9">
					<div class="block">
						<el-pagination layout="prev, pager, next" :total="total" :page-size="10" :current-page="currentPager" @size-change="handleSizeChange" @current-change="handleCurrentChange">
						</el-pagination>
					</div>
				</el-col>
			</el-row>

			<!-- 添加数据的弹框 -->
			<el-dialog title="添加" v-model="dialogFormVisible">
				<el-form :model="form">
					<el-form-item label="项目号" :label-width="formLabelWidth">
						<el-input v-model="form.number" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item label="项目名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item label="项目经理" :label-width="formLabelWidth">
						<el-select v-model="form.username" placeholder="请选择">
							<el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="项目预算" :label-width="formLabelWidth">
						<el-input v-model="form.cost" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="状态" :label-width="formLabelWidth">
						<el-select v-model="form.status" placeholder="请选择">
							<el-option v-for="item in proStatusOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="项目起始日期" :label-width="formLabelWidth">
						<el-date-picker v-model="form.starttime" @change="getStartTime" format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>

					</el-form-item>

					<el-form-item label="项目截止日期" :label-width="formLabelWidth">
						<el-date-picker v-model="form.endtime" @change="getEndTime" format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>

					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addProject">确 定</el-button>
				</div>
			</el-dialog>

			<el-dialog title="编辑" v-model="dialogProFormVisible">
				<el-form v-model="editProject">
					<el-form-item label="编号" :label-width="formLabelWidth">
						<el-input v-model="editProject.number" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item label="姓名" :label-width="formLabelWidth">
						<el-input v-model="editProject.name" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item label="项目经理" :label-width="formLabelWidth">
						<el-select v-model="editProject.username" placeholder="请选择">
							<el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="状态" :label-width="formLabelWidth">
						<el-select v-model="editProject.status" placeholder="请选择">
							<el-option v-for="item in proStatusOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="结束日期" :label-width="formLabelWidth">
						<el-date-picker @change="getEditEndTime" v-model="editProject.endtime" format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogProFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="updateProject">确 定</el-button>
				</div>
			</el-dialog>
		</div>

	</div>
</template>


<script>
var Time;
//实例
export default {
	name: 'index1',
	data() {
		return {
			userInfo: JSON.parse(sessionStorage.getItem('user')).data,
			search: '', //搜索框的初始值
			visible2: true,
			form: {},
			userList: [],
			proStatusOptions: this.GLOBAL.proStatusOpts,
			value: '',
			tableData: [],
			filterData: [],
			pageData: [],
			formLabelWidth: '100px', //添加数据弹框label标签宽度
			dialogFormVisible: false, //控制添加数据的弹框显示关闭
			total: 0,
			pageNum: 1,
			currentPager: 1,
			pageSize: 10,
			dialogProFormVisible: false,
			proRow: {},
			editProject: {},
			users: [],
		};
	},
	methods: {
		//方法
		//添加
		getStartTime(val) {
			this.form.starttime = val;
		},
		getEndTime(val) {
			this.form.endtime = val;
		},
		getEditEndTime(val) {
			this.editProject.endtime = val;
		},
		addProject() {
			var that = this;
			that.loading = true;
			var params = that.form;

			params = that.getParticularInfo(params);

			params.techmanager = params.techManager;

			var req_params = JSON.stringify(params);
			that
				.postRequest('/oy/project/add', { pro: req_params })
				.then(function(response) {
					console.log(response);
					that.loading = false;
					var errmsg = '新建项目成功';
					if (response.data.code == 0) {
						that.getProject(1);
					} else {
						errmsg = response.data.message;
					}
					that.$message({
						type: 'info',
						message: errmsg,
					});
					that.dialogFormVisible = false;
				})
				.catch(function(error) {
					console.log(error);
					that.loading = false;
					that.$message({
						type: 'info',
						message: '新建项目失败',
					});
				});
		},
		//获取用户列表 项目负责人（项目经理列表）
		getUser: function(page) {
			var that = this;
			let para = { name: '' };

//
			that
				.getRequest('/sys/user/list?name=' + para.name)
				.then(function(response) {
					that.loading = false;
					if (response.data.data != null) {
						that.users = response.data.data.list;
					} else {
						that.showErrMsg(response.data.message);
					}
				})
				.catch(function(err) {
					console.log(err);
					that.loading = false;
					that.showErrMsg('获取用户列表失败');
				});
		},
		showErrMsg(err) {
			var that = this;
			that.loading = false;
			that.$message({
				message: err,
				type: 'error',
			});
		},
		getProject(page) {
			var that = this;
			var userInfo = that.userInfo && that.userInfo != undefined ? that.userInfo : '';
			var uid = userInfo ? userInfo.id : '';
			let para = { page: page, size: 10 };
			that.loading = true;
			that
				.getRequest('/oy/project/list?params=' + encodeURI(JSON.stringify(para),"utf-8") + '&uid=' + uid)
				.then(function(response) {
					that.tableData = response.data.data.list;
					that.total = response.data.data.total;
					that.loading = false;
				})
				.catch(function(err) {
					that.loading = false;
					console.log(err);
				});
		},
		getParticularInfo(params) {
			var that = this;

			for (var j = 0; j < that.proStatusOptions.length; j++) {
				var pri = that.proStatusOptions[j];
				if (pri.label == params.status) {
					params.status = pri.value;
					break;
				}
			}
			return params;
		},
		updateProject() {
			var that = this;
			that.loading = false;
			var para = that.getParticularInfo(that.editProject);
			if (typeof para.username == 'string') {
				para.techmanager = para.techManager;
			} else {
				para.techmanager = para.username;
			}

			var req_params = JSON.stringify(para);
			that
				.postRequest('/oy/project/update', { pro: req_params })
				.then(function(response) {
					that.loading = false;
					var errmsg = '修改成功';
					if (response.data.code == 0) {
						that.getProject(1);
					} else {
						errmsg = response.data.message;
					}
					that.$message({
						type: 'info',
						message: errmsg,
					});
				})
				.catch(function(err) {
					that.loading = false;
					that.$message({
						type: 'info',
						message: '修改失败',
					});
					console.log(err);
				});
			that.dialogProFormVisible = false;
		},
		onClick(params) {
			// 命名的路由 gid项目ID
			this.$router.push({ name: '项目详情', params: { projectNumber: params.id } });
		},

		//删除
		handleDelete(index, row) {
			var that = this;
			that
				.$confirm('删除该项目吗', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
				.then(function(res) {
					that.loading = true;
					that
						.getRequest('/oy/project/delete/' + row.id)
						.then(function(response) {
							that.loading = false;
							console.log(response);
							if (response.data.code == 0) {
								that.getProject(1);
							} else {
								that.$message({
									type: 'info',
									message: response.data.message,
								});
							}
						})
						.catch(function(error) {
							that.loading = false;
							that.$message({
								type: 'info',
								message: '删除失败!',
							});
						});
				})
				.catch(function(err) {
					console.log(err);
					that.loading = false;
					that.$message({
						type: 'info',
						message: '已取消',
					});
				});
		},
		//编辑
		modify(index, row) {
			this.dialogProFormVisible = true;
			this.editProject = JSON.parse(JSON.stringify(row));
		},
		handleSizeChange(page) {
			this.pageNum = page;
		},
		handleCurrentChange(page) {
			var num = page * this.pageSize;
			this.currentPager = page;
			this.total = this.filterData.length;
			this.pageData = this.filterData.slice(num - this.pageSize, num);
			for (var i = 0; i < this.pageData.length; i++) {
				this.pageData[i].endtime = this.getStdTime(this.pageData[i].endtime);
				for (var j = 0; j < this.proStatusOptions.length; j++) {
					var pri = this.proStatusOptions[j];
					if (pri.value == this.pageData[i].status) {
						this.pageData[i].status = pri.label;
					}
				}
				for (var j = 0; j < this.users.length; j++) {
					var pri = this.users[j];
					if (pri.id == this.pageData[i].username) {
						this.pageData[i].username = pri.username;
					}
				}
			}
		},
		// 搜索
		handlersearch(val) {
			clearInterval(Time);
			var that = this;
			var reg = new RegExp('[' + val + ']{2,}');
			Time = setTimeout(function() {
				if (val == '' || val.length == 1) {
					that.filterData = that.tableData;
				} else {
					that.filterData = that.tableData.filter(function(item, i) {
						return reg.test(item.name) || reg.test(item.projectLeader);
					});
				}
			}, 500);
		},
		//判断月和日小于两位数，添加0
		mosaicData(data) {
			var date = data.split('-');
			date[1] = date[1].length == 1 ? '0' + date[1] : date[1];
			date[2] = date[2].length == 1 ? '0' + date[2] : date[2];
			return date.join('-');
		},
	},
	//监听数据
	watch: {
		search: function(val) {
			this.handlersearch(val);
		},
		filterData() {
			this.handleCurrentChange(this.currentPager);
		},
		tableData() {
			this.handlersearch(this.search);
		},
	},
	//初始化显示第一页数据
	created() {
		this.filterData = this.tableData;
		this.handleCurrentChange(1);
	},
	mounted() {
		this.getProject(1);
		this.dialogFormVisible = false;
		this.getUser(1);
	},
};
</script>



<style>
.index1 {
}
.box {
	width: 500px;
}
.el-form-item__label {
	line-height: 20px;
	font-size: 16px;
}

.add_btn {
	float: left;
	margin-bottom: 20px;
}

.el-dialog--small {
	max-width: 500px;
}

.el-dialog__body {
	padding-bottom: 0;
}
.el-form-item {
	margin-bottom: 0;
}
.el-row {
	margin-bottom: 20px;
}
.el-pagination {
	margin-top: 10px;
}
</style>



