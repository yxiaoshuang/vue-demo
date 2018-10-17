<template>
	<div class="index2">
		<el-card class="box-card">
			<h3>需求名称：{{demandInfo.title}}</h3>
		</el-card>
		<el-card class="box-card">
			<h3>需求详情</h3>
			<hr>
			<el-row :gutter="20">
				<el-col :span="4">
					<div class="grid-content">经办人：</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content red">{{demandInfo.assignusername}}</div>
				</el-col>
				<!-- <el-col :span="4"><div class="grid-content">创建人：</div></el-col> -->
				<!-- <el-col :span="8"><div class="grid-content">李四</div></el-col> -->
			</el-row>

			<el-row :gutter="20">
				<el-col :span="4">
					<div class="grid-content">创建时间：</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content red">{{demandInfo.createtime}}</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content">截止时间：</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content red">{{demandInfo.deadlinetime}}</div>
				</el-col>
			</el-row>

			<!--<el-row :gutter="20">-->
			<!--<el-col :span="4"><div class="grid-content">类型：</div></el-col>-->
			<!--<el-col :span="8"><div class="grid-content red">BUG</div></el-col>-->
			<!--<el-col :span="4"><div class="grid-content">状态：</div></el-col>-->
			<!--<el-col :span="8"><div class="grid-content">需求评审</div></el-col>-->
			<!--</el-row>-->

			<el-row :gutter="20">
				<el-col :span="4">
					<div class="grid-content">优先级：</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content">{{demandInfo.priorityname}}</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content">状态：</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content red">{{demandInfo.statusname}}</div>
				</el-col>
			</el-row>
		</el-card>

		<el-card class="box-card">
			<h3>需求描述：</h3>
			<hr> {{demandInfo.content}}
		</el-card>

		<!-- <el-card>
			<h3>需求附件</h3>
			<hr>
			<el-upload
					class="upload-demo"
					action="https://jsonplaceholder.typicode.com/posts/"
					:on-preview="handlePreview"
					:on-remove="handleRemove"
					:file-list="fileList2"
					list-type="picture">
				<el-button size="small" type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
		</el-card> -->

		<!-- <el-card> -->
		<!--<h3>改动记录</h3>-->
		<!-- <template>
				<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
					<el-tab-pane label="注释" name="0">注释</el-tab-pane>
					<el-tab-pane label="改动记录" name="1">改动记录</el-tab-pane>
				</el-tabs>
			</template>
			<hr>
			<div v-if="activeName2==0">
				<p>沈海伦 创建了 OYYSZG-234 - 在电商的订单管理中增加知钢服务的订单管理内容</p>
				<p>在电商的订单管理中增加知钢服务的订单管理内容，包括购买会员、提问、资料等业务的订单管理和开票功能。</p>
				<p>2018-06-08 4:15 下午</p>
			</div>
			<div v-if="activeName2==1" style="border-top: 1px solid #f2f2f2;">
				<p>沈海伦 创建了 OYYSZG-234 - 在电商的订单管理中增加知钢服务的订单管理内容</p>
				<p>在电商的订单管理中增加知钢服务的订单管理内容，包括购买会员、提问、资料等业务的订单管理和开票功能。</p>
				<p>2018-06-08 4:15 下午</p>
			</div>
		</el-card> -->

	</div>
</template>


<script>
export default {
	data() {
		return {
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			imageUrl: '',
			editUser: {},
			users: [],
			demandNumber: this.$route.params.demandNumber,
			activeName2: '0',
			dialogImageUrl: '',
			dialogVisible: false,
			dialogUserFormVisible: false,
			projectNumber: this.$route.params.projectNumber,
			formLabelWidth: '100px', //添加数据弹框label标签宽度

			priorityOptions: this.GLOBAL.demandPriorityOpts,
			demandStatusOpts: this.GLOBAL.demandStatusOpts,
			userIndex: 0,
			userRow: {},
			value: '',
			demandInfo: {},
		};
	},
	methods: {
		handleClick(tab, event) {
			this.activeName2 = tab.index;
		},
		handleDemandDetail(index, row) {
			this.$router.push({ name: 'demandDetail', params: { demandNumber: row.number } });
		},
		handleUserEdit(index, row) {
			this.dialogUserFormVisible = true;
			this.editUser = JSON.parse(JSON.stringify(row));
			this.userIndex = index;
			this.userRow = row;
		},
		handleUserDelete(index, tableData) {
			this.$confirm('是否删除该用户?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!',
					});
					tableData.splice(index, 1);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		handleAvatarScucess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		//获取用户列表
		getAllUser: function() {
			var that = this;
			that.loading = true;
			let para = {
				name: '',
			};
			that
				.getRequest('/sys/user/list?name=' + para.name)
				.then(function(response) {
					console.log(response);
					that.loading = false;
					if (response.data.code == 0) {
						that.users = response.data.data.list;
						that.getDemandInfoById();
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
		convertTimeStampToDate(timestamp) {
			var date = new Date(timestamp);
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate();
			return Y + M + D;
		},
		getDemandInfoById() {
			var that = this;
			var id = that.demandNumber;
			if (!id) return;
			that
				.getRequest('/oy/demand/detail' + '/' + id)
				.then(function(response) {
					that.demandInfo = response.data.data;
					that.demandInfo.deadlinetime = that.convertTimeStampToDate(that.demandInfo.deadlinetime);
					for (var i = 0; i < that.users.length; i++) {
						if (that.users[i].id == that.demandInfo.assignuser) {
							that.demandInfo.assignusername = that.users[i].username;
						}
					}
					for (var i = 0; i < that.users.length; i++) {
						if (that.users[i].id == that.demandInfo.createuser) {
							that.demandInfo.createusername = that.users[i].username;
						}
					}

					for (var j = 0; j < that.priorityOptions.length; j++) {
						if (that.priorityOptions[j].value == that.demandInfo.priority) {
							that.demandInfo.priorityname = that.priorityOptions[j].label;
							break;
						}
					}
					for (var j = 0; j < that.demandStatusOpts.length; j++) {
						if (that.demandStatusOpts[j].value == that.demandInfo.status) {
							that.demandInfo.statusname = that.demandStatusOpts[j].label;
							break;
						}
					}

					that.demandInfo.createtime = that.convertTimeStampToDate(that.demandInfo.createtime);
					that.demandInfo.deadlinetime = that.convertTimeStampToDate(that.demandInfo.deadlinetime);
				})
				.catch(function(err) {
					console.log(err);
				});
		},
	},
	mounted() {
		this.getAllUser();
		//		this.getDemandInfoById();
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
	margin-bottom: 0;
	&.col-right > span {
		float: right;
	}

	span {
		float: right;
	}
}
</style>









