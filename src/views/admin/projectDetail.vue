<template>
	<div class="index2">
		<el-card class="box-card">
			<h3>项目基础信息</h3>
			<hr>
			<el-row :gutter='10' type="flex">
				<el-col class="col-right" :span="3">
					<span>项目名称</span>
				</el-col>
				<el-col :span="21">
					<span>{{projectInfo.name}}</span>
				</el-col>
			</el-row>
			<el-row :gutter='10' type="flex">
				<el-col class="col-right" :span="3">
					<span>项目起始时间</span>
				</el-col>
				<el-col :span="21">
					<span>{{projectInfo.starttime}}~{{projectInfo.endtime}}</span>
				</el-col>
			</el-row>
		</el-card>

		<el-card>
			<h3>项目模块信息&nbsp;&nbsp;
				<i class="el-icon-plus" @click="addModules"></i>
			</h3>
			<hr>
			<div>
				<el-table :data="moduleData" border stripe style="width:100%">
					<el-table-column prop="title" label="编号" width="150"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleModuleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="danger" @click="handleModuleDelete(scope.$index,  scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>

		<el-card></el-date-picker>
			<h3>项目成员信息&nbsp;&nbsp;
				<i class="el-icon-plus" @click="addUser"></i>
			</h3>
			<hr>
			<!-- <p>使用 list-type 属性来设置文件列表的样式。</p> -->
			<div>
				<!-- 列表 -->
				<el-table :data="userLists" border stripe style="width:100%">
					<el-table-column label="姓名" width="180">
						<template slot-scope="scope">
							<span> {{scope.row.username}}</span> 
						</template>
					</el-table-column>
					<el-table-column label="加入日期">
						<template slot-scope="scope">
							<span> {{scope.row.createtime}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="danger" @click="handleUserDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<!--<el-row :gutter="20">-->
					<!--<el-col :span="12" :offset="9">-->
						<!--<div class="block">-->
							<!--<el-pagination layout="prev, pager, next" :total="totalUser" :page-size="10" :current-page="currentPager1" @size-change="handleSizeChange1" @current-change="handleCurrentChange1">-->
							<!--</el-pagination>-->
						<!--</div>-->
					<!--</el-col>-->
				<!--</el-row>-->
			</div>
		</el-card>

		<el-card>
			<h3>项目需求信息&nbsp;&nbsp;
				<i class="el-icon-plus" @click="addDemands"></i>
			</h3>
			<hr>
			<div>
				<el-table :data="demandTableData" border stripe style="width:100%">
					<el-table-column prop="mname" label="模块"></el-table-column>
					<el-table-column prop="number" label="编号"></el-table-column>
					<el-table-column prop="title" label="标题"></el-table-column>
					<el-table-column prop="username" label="开发人员" sortable></el-table-column>
					<el-table-column prop="deadlinetime" label="完成日期" sortable></el-table-column>
					<el-table-column prop="priorityName" label="优先级" sortable></el-table-column>
					<el-table-column prop="statusName" label="状态" sortable></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleDemandDetail(scope.row)">详情</el-button>
							<el-button size="mini" @click="handleDemandEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="danger" @click="handleDemandDelete(scope.row)">删除</el-button>
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
		</el-card>

		<el-dialog title="新增/编辑项目模块" v-model="dialogAddModule">
			<el-form v-model="ManagerInfo" :label-width="formLabelWidth">
				<el-form-item label="标题" :label-width="formLabelWidth">
					<el-input v-model="moduleForm.title" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" :label-width="formLabelWidth">
				<el-button @click="dialogAddModule = false">取 消</el-button>
				<el-button type="primary" @click="addModule">确 定</el-button>
			</div>
		</el-dialog>

		<!-- // name value joinDate -->
		<el-dialog title="新增项目人员" v-model="dialogaddManager">
			<el-form v-model="ManagerInfo" :label-width="formLabelWidth">
				<el-form-item label="姓名" :label-width="formLabelWidth">
					<el-select v-model="ManagerInfo.uid" placeholder="请选择">
						<el-option v-for="item in users" :key="item.uid" :label="item.label" :value="item.uid">
						</el-option>
					</el-select>
				</el-form-item>
				<!--<el-form-item label="角色" :label-width="formLabelWidth">-->
					<!--<el-select v-model="ManagerInfo.job" placeholder="请选择">-->
						<!--<el-option v-for="item in jobOpts" :key="item.value" :label="item.label" :value="item.value">-->
						<!--</el-option>-->
					<!--</el-select>-->
				<!--</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer" :label-width="formLabelWidth">
				<el-button @click="dialogaddManager = false">取 消</el-button>
				<el-button type="primary" @click="addManager">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="新增/编辑" v-model="dialogProFormVisible">
			<el-form v-model="demandForm">
				<el-form-item label="模块" :label-width="formLabelWidth">
					<el-select v-model="demandForm.mname" placeholder="请选择">
						<el-option v-for="item in moduleData" :key="item.id" :label="item.title" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="标题" :label-width="formLabelWidth">
					<el-input v-model="demandForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="内容" :label-width="formLabelWidth">
					<el-input type="textarea" v-model="demandForm.content" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="开发人员" :label-width="formLabelWidth" style="margin-top: 5px;">
					<el-select v-model="demandForm.username" placeholder="请选择">
						<el-option v-for="item in DevelopersList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="完成日期" :label-width="formLabelWidth">
					<el-date-picker   v-model="demandForm.deadlinetime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="getDeadlineTime"></el-date-picker>
				</el-form-item>

				<el-form-item label="优先级" :label-width="formLabelWidth" >
					<el-select v-model="demandForm.priority" placeholder="请选择">
						<el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="状态" :label-width="formLabelWidth">

					<el-select v-model="demandForm.status" placeholder="请选择">
						<el-option v-for="item in staOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<!-- <el-form-item label="上传附件" :label-width="formLabelWidth">
					<el-upload
							class="upload-demo"
							drag
							action="https://jsonplaceholder.typicode.com/posts/"
							mutiple>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogProFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDemand">确 定</el-button>
			</div>
		</el-dialog>

		<!-- <el-card> -->
		<!-- <h3>项目运行状况</h3>
			<hr>
			<el-upload
			  class="upload-demo"
			  drag
			  action="https://jsonplaceholder.typicode.com/posts/"
			  mutiple>
			  <i class="el-icon-upload"></i>
			  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload> -->
		<!-- </el-card> -->

	</div>
</template>
<script>
export default {
	data() {
		return {
			imageUrl: '',
			editUser: {},
			dialogImageUrl: '',
			dialogVisible: false,
			dialogUserFormVisible: false,
			projectNumber: this.$route.params.projectNumber,
			dialogProFormVisible: false,
			dialogAddModule: false,
			dialogaddManager: false,
			formLabelWidth: '100px', //添加数据弹框label标签宽度,
			demandForm: { deadlinetime: '' },
			ManagerInfo: {},
			jobOpts: this.GLOBAL.jobOpts,
			demandRow: {},
			moduleForm: {},
			staOptions: this.GLOBAL.demandStatusOpts,
			priorityOptions: this.GLOBAL.demandPriorityOpts,
			userIndex: 0,
			userRow: {},
			addType: '',
			addModuleType: '',
			value: '',
			tableData: [],
			moduleData: [],
			demandTableData: [],
			total: 0,
			totalUser: 0,
			currentPager: 1,
			currentPager1: 1,
			pageNum: 1,
			pageNum1: 1,
			progid: '', //项目ID
			users: [], //所有用户列表
			DevelopersList: [], //开发人员
			userLists: [],
			projectInfo: {},
		};
	},
	methods: {
		selectPriority(vId) {
			let obj = {};
			obj = this.priorityOptions.find(item => {
				//这里的userList就是上面遍历的数据源
				return item.value === vId; //筛选出匹配数据
			});
			return obj.value;
		},

		handleDemandEdit(index, row) {
			this.addType = 'update';
			this.dialogProFormVisible = true;
			this.demandForm = JSON.parse(JSON.stringify(row));
		},
		addDemands() {
			this.addType = 'add';
			this.dialogProFormVisible = true;
			this.demandForm = {};
		},
		//获取该项目下用户列表
		getUser: function(page) {
			var that = this;
			that.loading = true;
			var page = page ? page : 1;
			var obj = {
				page: page,
				per: ''
			};
			
			that.getRequest('/oy/pro/user/getUserListByGid?page=' + obj.page + '&size=' + obj.per + '&gid=' + that.projectNumber)
				.then(function(response) {

					console.log(response);
					that.loading = false;
					if (response.data.code == 0) {
						that.userLists = response.data.data.list;
						that.totalUser = response.data.data.total;
						for (var i = 0; i < that.userLists.length; i++) {
							var row = that.userLists[i];
							row.createtime = that.convertTimeStampToDate(row.createTime);
						}
					} else {
						that.showErrMsg(response.data.message);
					}
				})
				.catch(function(err) {
					that.loading = false;
					console.log(err);
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
		//getAllUserByType// 1开发人员
		getAllUserByType: function(page, flag) {
			var that = this;
			let para = {
				name: '',
			};
			that
				.getRequest('/sys/user/list?name=' + para.name)
				.then(function(response) {
					that.loading = false;
					if (response.data.data != null) {
						var list = response.data.data.list;
						for (var i = 0; i < list.length; i++) {
							that.users.unshift({ value: list[i].eid, label: list[i].username, uid: list[i].id });
						}
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
		getDevUserList(){
			var that = this;
			that.DevelopersList = [];
			that
					.getRequest('/oy/pro/user/getDevUserListByGid/' + parseInt(that.projectNumber))
					.then(function(response) {
						if (response.data.data != null) {
							var list = response.data.data;
							for (var i = 0; i < list.length; i++) {
								that.DevelopersList.unshift({ value: list[i].id, label: list[i].username});
							}
						} else {
							that.showErrMsg(response.data.message);
						}
					})
					.catch(function(err) {
						console.log(err);
						that.showErrMsg('获取用户列表失败');
					});
		},
		handleModuleEdit(index, row) {
			this.moduleForm = row;
			this.addModuleType = 'update';
			this.dialogAddModule = true;
			this.moduleForm = JSON.parse(JSON.stringify(row));
		},
		addModules() {
			this.addModuleType = 'add';
			this.dialogAddModule = true;
			this.moduleForm = {};
		},
		addModule(row) {
			var that = this;
			if (that.addModuleType == 'add') {
				that.moduleForm.gid = that.projectNumber;
				var req_params = JSON.stringify(that.moduleForm);
				that
					.postRequest('/oy/pro/module/add', { mod: req_params })
					.then(function(response) {
						if (response.data.code == 0) {
							that.moduleData = [];
							that.currentPager = 1;
							that.getModuleData(1);
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			} else if (that.addModuleType == 'update') {
				var req_params = JSON.stringify(that.moduleForm);

				that
					.postRequest('/oy/pro/module/update', { mod: req_params })
					.then(function(response) {
						that.moduleData = [];
						that.getModuleData(1);
					})
					.catch(function(error) {
						console.log(error);
					});
			}
			that.dialogAddModule = false;
			that.moduleForm = {};
		},
		getModuleData: function(page) {
			var that = this;
			let para = { page: page, per: 10, gid: that.projectNumber };
			that
				.getRequest('/oy/pro/module/list?page=' + para.page + '&size=' + para.per + '&gid=' + para.gid)
				.then(function(response) {
					that.moduleData = response.data.data.list;
				})
				.catch(function(err) {
					console.log(err);
				});
		},
		getDemands: function(page) {
			var that = this;
			that.loading = true;
			page = page ? page : 1;
			var params = { page: page, per: 10 };
			that
				.getRequest(
					'/oy/demand/getDemandListByGid?page=' +
						params.page +
						'&size=' +
						params.per +
						'&gid=' +
						that.projectNumber
				)
				.then(function(response) {
					that.demandTableData = [];
					for (var i = 0; i < response.data.data.list.length; i++) {
						var row = response.data.data.list[i];
						that.total = response.data.data.total;
						for (var j = 0; j < that.staOptions.length; j++) {
							var pri = that.staOptions[j];
							if (pri.value == row.status) {
								row.statusName = pri.label;
							}
						}
						for (var j = 0; j < that.priorityOptions.length; j++) {
							var pri = that.priorityOptions[j];
							if (pri.value == row.priority) {
								row.priorityName = pri.label;
							}
						}
						row.deadlinetime = that.convertTimeStampToDate(row.deadlineTime);
						that.demandTableData.push(row);
					}
					that.loading = false;
				})
				.catch(function(err) {
					console.log(err);
				});
		},
		getDeadlineTime(val) {
			//console.log(typeof val);
			this.demandForm.deadlinetime = val; //这个sTime是在data中声明的，也就是v-model绑定的值
		},
		addDemand: function() {
			var that = this;
			if (that.addType == 'add') {
				that.demandForm.gid = that.projectNumber;
				var req_params = JSON.stringify(that.demandForm);
				that
					.postRequest('/oy/demand/add', { dem: req_params })
					.then(function(response) {
						if (response.data.code == 0) {
							that.currentPager = 1;
							that.getDemands(1);
							that.showErrPopup('新增成功');
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			} else if (that.addType == 'update') {
				var para = that.demandForm;
				if(typeof(para.username)=="string"){
					para.assignuser = para.assignUser;
				}else{
					para.assignuser = para.username;
				}

				if(typeof(para.mname)=="string"){
				}else{
					para.mid = para.mname;
				}


				var req_params = JSON.stringify(para);

			
				that
					.postRequest('/oy/demand/update', { dem: req_params })
					.then(function(response) {
						if (response.data.code == 0) {
							that.demandTableData = [];
							that.getDemands(1);
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			}
			that.dialogProFormVisible = false;
			that.demandForm = {};
		},
		handleDemandDetail(row) {
			this.$router.push({
				name: '需求详情',
				params: { demandNumber: row.id },
			});
		},
		handleUserEdit(index, row) {
			this.dialogUserFormVisible = true;
			this.editUser = JSON.parse(JSON.stringify(row));
			this.userIndex = index;
			this.userRow = row;
		},
		handleDemandDelete(row) {
			var that = this;
			that.loading = true;
			that
				.$confirm('是否删除该需求?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
				.then(function() {
					that
						.getRequest('/oy/demand/delete/' + row.id)
						.then(function(response) {
							that.showErrPopup('删除成功');
							that.demandTableData = [];
							that.getDemands(1);
						})
						.catch(function(error) {
							that.showErrPopup('删除失败');
						});
				})
				.catch(function(err) {
					that.showErrPopup('已取消删除');
				});
		},
		showErrPopup(msg) {
			var that = this;
			that.loading = false;
			that.$message({
				type: 'info',
				message: msg,
			});
		},
		handleModuleDelete(index, row) {
			var that = this;
			that
				.$confirm('是否删除该模块?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
				.then(function() {
					that
						.getRequest('/oy/pro/module/delete/' + row.id)
						.then(function(response) {
							if (response.data.code == 0) {
								that.moduleData = [];
								that.getModuleData(1);
							} else {
								that.showErrMsg(response.data.message);
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				})
				.catch(function() {
					that.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		handleUserDelete(index, tableData) {
			console.log(tableData);
			var that = this;
			that
				.$confirm('是否删除该用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
				.then(function() {
					that
						.getRequest('/oy/pro/user/delete/' + tableData.id)
						.then(function(response) {
							that.$message({
								type: 'success',
								message: '删除成功!',
							});
							that.getDevUserList();
							that.userLists.splice(index, 1);
						})
						.catch(function(err) {
							console.log(err);
							that.showErrMsg('删除失败!');
						});
				})
				.catch(function() {
					that.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		addUser() {
			this.dialogaddManager = true;
			this.ManagerInfo = {};
		},
		choiceRole(params) {
			var that = this;
			var obj = {
				gid: that.projectNumber,
				job: params.job,
				uid: params.uid,
			};
			var req_params = JSON.stringify(obj);
			that
				.postRequest('/oy/pro/user/update', { puser: req_params })
				.then(function(response) {
					if (response.data.code == 0) {
						that.$message({
							type: 'success',
							message: '更新角色成功!',
						});
					} else {
						that.showErrMsg(response.data.message);
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		addManager() {
			var that = this;
			that.ManagerInfo.gid = that.projectNumber;
			that.dialogaddManager = false;
			that.tableData.push(that.ManagerInfo);
			var user = sessionStorage.getItem('user');
			var req_params = JSON.stringify(that.ManagerInfo);

			that
				.postRequest('/oy/pro/user/add', { puser: req_params })
				.then(function(response) {
					if (response.data.code == 0) {
						//
						that.getUser(1);
						that.getDevUserList();
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		updateUser() {
			this.userRow.role = this.editUser.role;
			this.userRow.name = this.editUser.name;
			this.userRow.eid = this.editUser.eid;
			this.userRow.joinDate = this.editUser.joinDate;
			this.dialogUserFormVisible = false;
		},
		handleRemove(file, fileList) {
			//console.log(file, fileList);
		},
		handlePreview(file) {
			// console.log(file);
		},
		handleAvatarScucess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleSizeChange(page) {
			this.pageNum = page;
		},
		handleSizeChange1(page) {
			this.pageNum1 = page;
		},
		handleCurrentChange1(page) {
			this.currentPager1 = page;
			this.getUser(page);
		},
		handleCurrentChange(page) {
			this.currentPager = page;
			this.getDemands(page);
		},
		getProjectInfo() {
			var that = this;
			var id = that.projectNumber;
			if (!id) return;
			that
				.getRequest('/oy/project/' + id)
				.then(function(response) {
					that.projectInfo = response.data.data;
					that.projectInfo.starttime = that.convertTimeStampToDate(that.projectInfo.starttime);
					that.projectInfo.endtime = that.convertTimeStampToDate(that.projectInfo.endtime);
				})
				.catch(function(err) {
					console.log(err);
				});
		},
	},
	mounted() {
		this.getDemands();
		this.getAllUserByType(1, 1);
		this.getUser();
		this.getProjectInfo();
		this.getModuleData(1);
		this.getDevUserList();
	},
};
</script>


<style>
.index2 > div {
	margin: 20px 0 20px 0;
}

.index2 > div > hr {
	margin: 20px 0 20px 0;
}

p {
	font-size: 12px;
	color: #999;
}
.index2 h3 {
	color: #666;
	margin-bottom: 10px;
}
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #20a0ff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}

.el-row {
	margin-bottom: 20px;
	&:last-child {
		margin-bottom: 0;
	}

	.col-right > span {
		float: right;
	}

	span {
		float: right;
	}
}
</style>









