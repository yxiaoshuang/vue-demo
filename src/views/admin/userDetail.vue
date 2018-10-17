<template>
	<section>

		<el-dialog title="新增/修改" v-model="dialogFormVisible">
			<!--<el-form :model="form">-->
			<el-form v-model="form">
				<el-form-item label="工号" :label-width="formLabelWidth">
					<el-input v-model="form.eid" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="姓名" :label-width="formLabelWidth">
					<el-input v-model="form.name" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item v-if="formType=='add'" label="密码" :label-width="formLabelWidth">
					<el-input v-model="form.password" value=""  auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="电话" :label-width="formLabelWidth">
					<el-input v-model="form.tel" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="邮箱" :label-width="formLabelWidth">
					<el-input v-model="form.email" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="状态" :label-width="formLabelWidth">
					<el-switch
							v-model="form.status"
							active-color="#13ce66"
							inactive-color="#ff4949">
					</el-switch>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="add">确 定</el-button>
			</div>
		</el-dialog>

		<el-row :gutter="20">
			<el-col :span="6"><div class="">姓名：陈陈</div></el-col>
			<el-col :span="6"><div class="">邮箱：chenxuping@ouyeel.com</div></el-col>
		</el-row>



	</section>
</template>
<script>
	import { getUserList } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				form:{   //添加列表时,初始化数据
					eid:'',
					tel:'',
					email:"",
					username:'',
					status:true,
					password:''
				},
				formLabelWidth:'100px', //添加数据弹框label标签宽度
				dialogFormVisible:false, //控制添加数据的弹框显示关闭
				total:0,
				pageNum:1,
				currentPager:1,
				pageSize:10,
				loading: false,
				users: [],
				filterUsers:[],
				dialogTitle:'',
				formType:'',
				row:{},
				idx:0
			}
		},
		methods: {
			//性别显示转换
//			formatSex: function (row, column) {
//				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
//			},
			formatSta:function(row,column){
				return row.status == 1 ? '在职' : row.status == 0 ? '离职' : '未知';
			},

			//添加
			add(){
				if(this.formType=='add'){
					this.users.unshift(Object.assign({},this.form));
				}else if(this.formType=='update'){
					this.row=JSON.parse(JSON.stringify(this.form));
				}
				this.dialogFormVisible = false;
				this.handleCurrentChange(1);
				this.form = {   //添加列表时,初始化数据
					eid:'',
					tel:'',
					email:"",
					username:'',
					status:true
				}
			},
			del(index,row){

			},
			test(){
			},
			handleSizeChange(page){
				this.pageNum = page;
				let para = {
					name: this.filters.name,
					page:page,
					per:10
				};
				this.loading = true;
					//NProgress.start();
					getUserList(para).then((res) => {
						console.log(res);
					this.users = res.data.users;
					this.loading = false;
				});
			},
			//删除
			handleDelete(index, row){
				var that = this;
				that.$confirm('删除该用户吗', '提示', {
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(function () {//编辑保存
					that.$message({
						type: 'success',
						message: '删除成功!'
					});
					that.users.splice(index, 1);
				}).catch(function () {  //编辑取消
					that.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			handleUpdate(index,row){
				this.dialogFormVisible = true;
				if(typeof(row)!="undefined"){
					this.row = row;
					this.form=JSON.parse(JSON.stringify(row));
					this.idx = index;
					console.log(this.idx);
					this.formType = "update";
					this.dialogTitle="修改";
				}else{
					this.formType = "add";
					this.dialogTitle="新增";
					this.form = {password:111111};
				}
			},
			//启停
			handleShutOn(index, row){
				//alert(this.tableData[index]['status']);
				this.users[index]['status'] = this.users[index]['status'] == true ? false:true;
			},


			handleCurrentChange(page){
				var num = page * this.pageSize;
				this.currentPager = page;
//				this.total = this.filterUsers.length;
				this.pageData = this.filterUsers.slice(num-this.pageSize,num);
			},
			//获取用户列表
			getUser: function () {
				let para = {
					name: this.filters.name,
					page:1,
					per:10
				};
				this.loading = true;
				//NProgress.start();
				getUserList(para).then((res) => {
					console.log(res);
					this.users = res.data.users;
					this.loading = false;
					this.total = 30;
					//NProgress.done();
				});
			},
			//判断月和日小于两位数，添加0
			mosaicData(data){
				var date = data.split('-');
				date[1] = date[1].length == 1 ? '0' + date[1] :date[1];
				date[2] = date[2].length == 1 ? '0' + date[2] :date[2];
				return date.join('-');
			}
		},
		mounted() {
			this.getUser();
			this.dialogFormVisible = false;
		},
		//监听数据
		watch:{
			search:function(val){
//				this.handlersearch(val);
			},
			filterUsers(){
				this.handleCurrentChange(this.currentPager);

			},
			tableData(){
//				this.handlersearch(this.search);
			}

		},
		//初始化显示第一页数据
		created(){
			this.filterUsers = this.users;
			this.handleCurrentChange(1);

		}
	};

</script>

<style scoped>

</style>