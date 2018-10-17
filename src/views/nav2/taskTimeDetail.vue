<template>
	<div class="">
		<div class="card">
			<div>
				<el-row align="middle" :gutter="20" type="flex">
					<el-col :span="16">
						<h2>第{{proTimeWeek}}周
							<br/>
							<p v-if="isAddWeek">*点击投入百分比可修改投入比例</p>
						</h2>
					</el-col>
					<el-col :span="8">
						<el-button class="add_btn" @click="dialogFormVisible = true" v-if="isAddWeek">新增</el-button>
					</el-col>
				</el-row>
			</div>
			<el-table :data="TaskDetailList" border stripe>
				<el-table-column label="项目名称" prop="gname"></el-table-column>
				<el-table-column label="模块" prop="mtitle"></el-table-column>
				<el-table-column label="任务" prop="title"></el-table-column>
				<el-table-column label="投入百分比">
					<template slot-scope='scope'>
						<el-input v-if="scope.row.edit" v-model='scope.row.per'></el-input>
						<div v-if="!scope.row.edit" @click="chengenum(scope.row,scope.$index)">{{scope.row.per}}% </div>
					</template>
				</el-table-column>
				<el-table-column label="操作" v-if="isAddWeek">
					<template slot-scope="scope">
						<el-button size="mini" type="danger" @click="saveProInfo(scope.row,scope.$index)">保存</el-button>
						<el-button size="mini" type="danger" @click="deleteDemand(scope.row,scope.$index)">删除</el-button>
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
		</div>
		<!-- 新增弹框 -->
		<el-dialog title="新增" v-model="dialogFormVisible" :before-close="handleBeforeClose">
			<el-form :model="editProInfo">
				<el-form-item label="项目名称" :label-width="formLabelWidth">
					<el-select v-model="editProInfo.gid" placeholder="请选择" @change="showDemandList('pro')">
						<el-option v-for="item in proList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模块" :label-width="formLabelWidth">
					<el-select v-model="editProInfo.mid" placeholder="请选择" @change="showDemandList('module')">
						<el-option v-for="item in moduleData" :key="item.id" :label="item.title" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务" :label-width="formLabelWidth">
					<el-select v-model="editProInfo.taskId" placeholder="请选择">
						<el-option v-for="item in proDemand" :key="item.id" :label="item.title" :value="item.id" :disabled="item.disabled">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="投入百分比" :label-width="formLabelWidth">
					<el-input v-model="editProInfo.process" auto-complete="off" style="width:217px;" clearable></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="addProjectDemand('add')">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>
<style>
.card {
	padding: 10px;
	border: 1px solid #d1dbe5;
	border-radius: 4px;
	background-color: #fff;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0;
}
</style>
<script>
export default {
	data() {
		return {
			proTimeWeek: this.$route.params.proTimeWeek,
			dialogFormVisible: false, //初始化
			isAddWeek: false, //初始化新增按钮为不可用状态
			editProInfo: {},
			TaskDetailList: [],
			formLabelWidth: '100px', //添加数据弹框label标签宽度
			userInfo: JSON.parse(sessionStorage.getItem('user')).data,
			proList: [],
			params: this.$route.query,
			proIds: [], //存储已添加项目的项目id
			moduleData: [], //模块数据
			proDemand: [], //任务数据
			totlePer: '', //计算总的百分比
			currentPager: 1,
			pageNum: 1,
			total: 0,
			pageSize: 10,
		};
	},
	methods: {
		handleSizeChange(page) {
			this.pageNum = page;
		},
		handleCurrentChange(page) {
			this.currentPager = page;
		},
		chengenum(row, ind) {
			for (var i = 0; i < this.TaskDetailList.length; i++) {
				let litem = this.TaskDetailList[i];
				this.$set(litem, 'edit', false);
			}
			this.$set(this.TaskDetailList[ind], 'edit', true);
		},
		addProjectDemand: function(type) {
			var that = this;
			if (type == 'add') {
				let addValList = [];
				var errmsg = '';
				if (!that.editProInfo.gid) {
					errmsg = '请选择项目';
				} else if (!that.editProInfo.mid) {
					errmsg = '请选择任务模块';
				} else if (!that.editProInfo.taskId) {
					errmsg = '请选择任务';
				} else if (!that.editProInfo.process) {
					errmsg = '请输入投入百分比';
				}

				if (errmsg) {
					that.$message({
						showClose: true,
						message: errmsg,
					});
					return;
				}
				if (that.totlePer + Number(that.editProInfo.process) > 100) {
					that.$message({
						showClose: true,
						message: '投入百分比不能超过100%',
					});
					return;
				}
				let obj = {
					gid: that.editProInfo.gid,
					mid: that.editProInfo.mid,
					demandid: that.editProInfo.taskId,
					week: that.proTimeWeek,
					per: that.editProInfo.process,
				};
				addValList.push(obj);
				let req_params = JSON.stringify(addValList);
				that.proIds.push(that.editProInfo.taskId);
				that
					.postRequest('/oy/task/add', { tasks: req_params })
					.then(function(response) {
						if (response.data.code == 0) {
							that.dialogFormVisible = false;
							var obj = {
								demandId: that.editProInfo.taskId,
								week: that.proTimeWeek,
								mid: that.editProInfo.mid,
								per: that.editProInfo.process,
								gId: that.editProInfo.gid,
								edit: false,
								id: response.data.data,
							};
							for (var i = 0; i < that.moduleData.length; i++) {
								if (that.moduleData[i].id == obj.mid) {
									obj.mtitle = that.moduleData[i].title;
								}
							}
							for (var i = 0; i < that.proList.length; i++) {
								if (that.proList[i].id == obj.gId) {
									obj.gname = that.proList[i].name;
								}
							}
							for (var i = 0; i < that.proDemand.length; i++) {
								if (that.proDemand[i].id == obj.demandId) {
									obj.title = that.proDemand[i].title;
								}
							}
							that.TaskDetailList.push(obj);
							that.totlePer = that.totlePer + Number(that.editProInfo.process);
							that.$message({
								showClose: true,
								message: '新增成功',
							});
							that.editProInfo = {
								gid: '',
								mid: '',
								taskId: '',
							};
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		},

		getProList: function() {
			//根据uid找该用户参与的项目showDemandList

			var that = this;
			that
				.getRequest('/oy/pro/user/getProjectsByUid/' + that.userInfo.id)
				.then(function(response) {
					if (response.data.code == 0 && response.data.data != null) {
						that.proList = response.data.data;
						if (that.params.flag == 'add') {
						} else {
							that.getTaskDetail();
						}
					}
					that.loading = false;
				})
				.catch(function(err) {
					console.log(err);
					that.loading = false;
				});
		},
		getTaskDetail: function() {
			var that = this;
			let sunArr = [];
			that
				.getRequest('/oy/task/getTaskByWeek/' + that.userInfo.id + '/' + that.proTimeWeek)
				.then(function(response) {
					if (response.data.code == 0) {
						that.TaskDetailList = response.data.data;
						that.total = that.TaskDetailList.length;
						for (var i = 0; i < that.TaskDetailList.length; i++) {
							let item = that.TaskDetailList[i];
							that.$set(item, 'edit', false);
							sunArr.push(item.per);
							that.proIds.push(item.demandId);
						}
						that.totlePer = that.countSum(sunArr);
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		handleBeforeClose: function(done) {
			done();
			this.editProInfo = {
				gid: '',
				mid: '',
				taskId: '',
				process: '',
			};
		},
		closeDialog: function() {
			this.dialogFormVisible = false;
			this.editProInfo = {
				gid: '',
				mid: '',
				taskId: '',
				process: '',
			};
		},
		showDemandList: function(type) {
			var that = this;
			if (type == 'pro') {
				let para = { page: 1, per: '', gid: that.editProInfo.gid };
				that
					.getRequest('/oy/pro/module/list?page=' + para.page + '&size=' + para.per + '&gid=' + para.gid)
					.then(function(response) {
						that.moduleData = response.data.data.list;
						that.loading = false;
					})
					.catch(function(err) {
						console.log(err);
						that.loading = false;
					});
			} else if (type == 'module') {
				that
					.getRequest(
						'/oy/demand/getDemandsByUid?uid=' +
							that.userInfo.id +
							'&gid=' +
							that.editProInfo.gid +
							'&mid=' +
							that.editProInfo.mid
					)
					.then(function(response) {
						that.proDemand = response.data.data;
						for (var i = 0; i < that.proDemand.length; i++) {
							that.proDemand[i].disabled = false;
							if (that.proIds.indexOf(that.proDemand[i].id) != -1) {
								that.proDemand[i].disabled = true;
							}
						}
						that.loading = false;
					})
					.catch(function(err) {
						console.log(err);
						that.loading = false;
					});
			}
		},
		saveProInfo: function(params, index) {
			let that = this;
			let sunArr = [];
			for (var i = 0; i < that.TaskDetailList.length; i++) {
				let item = that.TaskDetailList[i];
				sunArr.push(Number(item.per));
			}
			that.totlePer = that.countSum(sunArr);
			if (that.totlePer > 100) {
				that.$message({
					showClose: true,
					message: '投入百分比不能超过100%',
				});
				return;
			}
			let objList = [];
			let obj = {
				gid: params.gId,
				id: params.id,
				week: params.week,
				per: params.per,
			};
			let req_params = JSON.stringify(obj);
			that
				.postRequest('/oy/task/update', { tasks: req_params })
				.then(function(response) {
					if (response.data.code == 0) {
						// let total = [];
						for (var i = 0; i < that.TaskDetailList.length; i++) {
							let item = that.TaskDetailList[i];
							that.$set(item, 'edit', false);
						}
						that.$message({
							showClose: true,
							message: '保存成功',
						});
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		deleteDemand: function(params, index) {
			var that = this;
			that
				.$confirm('是否删除该项工时?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
				.then(function() {
					that
						.getRequest('/oy/task/delete/' + params.id)
						.then(function(response) {
							if (response.data.code == 0) {
								that.totlePer = that.totlePer - that.TaskDetailList[index].per;
								that.TaskDetailList.splice(index, 1);
								that.proIds.splice(index, 1);
								that.$message({
									showClose: true,
									message: '删除成功',
								});
								that.editProInfo = {
									gid: '',
									mid: '',
									taskId: '',
								};
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				})
				.catch(function(err) {
					that.$message({
						showClose: true,
						message: '已取消删除',
					});
				});
		},
	},
	created: function() {
		//实例被创建时
		// console.log(this.$route); //获取路由参数
		if (this.proTimeWeek == this.functiontheWeek()) {
			this.isAddWeek = true;
		} else {
			this.isAddWeek = false;
		}
		this.getProList();
	},
};
</script>
