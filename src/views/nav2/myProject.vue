<template>
	<div class="index1">
		<!-- 条件查询 -->
		<el-row align="middle" :gutter="20" type="flex">
			<el-col :span="16">
				<el-form>
					<el-form-item label="请输入查询的姓名和地址" label-width="200px">
						<el-input size="large" v-model="search"></el-input>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<div>
			<!-- 列表 -->
			<el-table :data="pageData" border stripe style="width:100%">
				<el-table-column  prop="number"  label="项目遍号"  width="180"></el-table-column>
				<el-table-column  prop="name"  label="项目名称"  width="180"></el-table-column>
				<el-table-column  prop="manager"  label="商务经理"  width="180"></el-table-column>
				<el-table-column  prop="techManager"  label="技术经理"  width="180"></el-table-column>
				<el-table-column prop="status"  label="状态"  width="100"></el-table-column>
				<el-table-column prop="endTime"  label="项目结束日期"  width="180"></el-table-column>
				<el-table-column  operation="操作"  label="操作">
					<template slot-scope="scope">
						<el-button  size="small"  @click="onClick()">详情</el-button>
						<!--<el-button  size="small"  @click="hoursClick()">工时填报</el-button>-->
						<!--<el-popover-->
						<!--placement="left"-->
						<!--width="300">-->
						<!--<el-table :data="gridData">-->
						<!--<el-table-column width="100" property="name" label="姓名"></el-table-column>-->

						<!--<el-table-column width="200" label="工作">-->
						<!--<template slot-scope="scope">-->
						<!--<el-select v-model="value" placeholder="请选择">-->
						<!--<el-option-->
						<!--v-for="item in options"-->
						<!--:key="item.value"-->
						<!--:label="item.label"-->
						<!--:value="item.value">-->
						<!--</el-option>-->
						<!--</el-select>-->
						<!--</template>-->

						<!--</el-table-column>-->
						<!--</el-table>-->
						<!--<el-button size="small" slot="reference">人员管理</el-button>-->
						<!--</el-popover>-->
						<!--<el-popover placement="right" width="400" trigger="click">-->

						<!--<el-button slot="reference">人员管理</el-button>-->


						<!--&lt;!&ndash;<el-button slot="reference">click 激活</el-button>&ndash;&gt;-->
						<!--</el-popover>-->
						<!--<el-button  size="small"  @click="memberManage()">人员管理</el-button>-->
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-row :gutter="20">
				<el-col :span="12" :offset="9">
					<div class="block">
						<el-pagination
								layout="prev, pager, next"
								:total="total"
								:page-size="10"
								:current-page="currentPager"
								@size-change="handleSizeChange"
								@current-change="handleCurrentChange"
						>
						</el-pagination>
					</div>
				</el-col>
			</el-row>

		</div>

	</div>
</template>


<script>
	import { getProjectList } from '../../api/api';
	var Time;
	//实例
	export default{
		name:'index1',
		data() {
			return {
				search:'', //搜索框的初始值
				visible2:true,
				form:{   //添加列表时,初始化数据
					projectNumber:'',
					startDate:'',
					name:'',
					projectLeader:''
				},
				options: [{
					value: '项目经理',
					label: '项目经理'
				}, {
					value: '技术经理',
					label: '技术经理'
				}, {
					value: '开发',
					label: '开发'
				}, {
					value: '测试',
					label: '测试'
				}, {
					value: '运营',
					label: '运营'
				}],
				proStatusOptions:[{
					value: '未立项',
					label: '未立项'
				}, {
					value: '已立项',
					label: '已立项'
				}, {
					value: '开发中',
					label: '开发中'
				}, {
					value: '开发完成',
					label: '开发完成'
				}],
				value: '',
				gridData: [{
					name: '王小虎',
					job: '项目经理'
				}, {
					name: '王小虎',
					job: '开发'
				}, {
					name: '王小虎',
					job: '开发'
				}, {
					name: '王小虎',
					job: '测试'
				}],
				tableData:[],
				filterData:[],
				pageData:[],
				formLabelWidth:'100px', //添加数据弹框label标签宽度
				dialogFormVisible:false, //控制添加数据的弹框显示关闭
				total:0,
				pageNum:1,
				currentPager:1,
				pageSize:10 ,
				dialogProFormVisible:false,
				proIndex:0,
				proRow:{},
				editProject:{}
			}
		},
		methods:{  //方法
			getProject(){
				let para = {
					name: '',
					page:1,
					per:10
				};
				this.loading = true;
				getProjectList(para).then((res) => {
					console.log(res);
				this.tableData = res.data.projects;
				this.loading = false;
				this.total = 30;
			});
			},
			hoursClick(){
				this.$router.push({ name: 'taskTime', params: { projectNumber: '000001' }})
			},
			updateProject(){
				console.log(this.editProject.endTime);
				this.proRow.name = this.editProject.name;
				this.proRow.manager = this.editProject.manager;
				this.proRow.techManager = this.editProject.techManager;
				this.proRow.endTime = this.getStdTime(this.editProject.endTime);
				this.proRow.status = this.editProject.status;
				this.dialogProFormVisible = false;

			},
			getStdTime(time){
				var d = new Date(time);
				var endTime = d.getFullYear() + '-' + ((d.getMonth() + 1)<10?'0'+(d.getMonth() + 1):(d.getMonth() + 1)) + '-' + (d.getDate()<10?'0'+d.getDate():d.getDate());
				return endTime;
			},
			onClick(){
				// 命名的路由
				this.$router.push({ name: 'projectDetail', params: { projectNumber: '000001' }})
				//this.$router.push({
				//	path: '/shopDetail',
				//	query: {
				//		shopNo: shopNo||"SHOPc22185ebe6df435ab90142d89c7e3829"
				//	}
				//})
			},

			//删除
			handleDelete(index, row){
				this.tableData.splice(index, 1);
			},
			//编辑
			modify(index, row) {
				this.dialogProFormVisible = true;
				this.proIndex = index;
				this.proRow = row;
				this.editProject = JSON.parse(JSON.stringify(row));
//                var that = this;
//                this.$prompt('修改项目名称', '编辑', {
//                    confirmButtonText:'保存',
//                    cancelButtonText:'取消',
//                    inputValue:row.name
//                }).then(function ({value}) {//编辑保存
//                    row.name = value;
//                }).catch(function () {  //编辑取消
//                    that.$message({
//                        type:'info',
//                        message:'取消编辑'
//                    });
//                });
			},
			handleSizeChange(page){
				this.pageNum = page;
			},
			handleCurrentChange(page){
				var num = page * this.pageSize;
				this.currentPager = page;
				this.total = this.filterData.length;
				this.pageData = this.filterData.slice(num-this.pageSize,num);
			},
			// 搜索
			handlersearch(val){
				clearInterval(Time);
				var that = this;
				var reg = new RegExp('['+val+']{2,}');
				Time = setTimeout(function(){
					if(val == '' || val.length == 1){
						that.filterData = that.tableData;
					}else{
						that.filterData = that.tableData.filter(function(item,i){
							return reg.test(item.name) || reg.test(item.projectLeader)
						});
					}
				},500)
			},
			//判断月和日小于两位数，添加0
			mosaicData(data){
				var date = data.split('-');
				date[1] = date[1].length == 1 ? '0' + date[1] :date[1];
				date[2] = date[2].length == 1 ? '0' + date[2] :date[2];
				return date.join('-');
			}

		},
		//监听数据
		watch:{
			search:function(val){
				this.handlersearch(val);
			},
			filterData(){
				this.handleCurrentChange(this.currentPager);

			},
			tableData(){
				this.handlersearch(this.search);
			}

		},
		//初始化显示第一页数据
		created(){
			this.filterData = this.tableData;
			this.handleCurrentChange(1);

		},
		mounted() {
			this.getProject();
			this.dialogFormVisible = false;
		},
	}



</script>



<style>

	.index1{
	}
	.box{
		width:500px;
	}
	.el-form-item__label{
		line-height:20px;
		font-size:16px;
	}

	.add_btn {
		float:left;
	}

	.el-dialog--small {
		max-width:500px;
	}

	.el-dialog__body {
		padding-bottom:0;
	}
	.el-form-item{
		margin-bottom:0;
	}
	.el-row{
		margin-bottom:20px;
	}
	.el-pagination{
		margin-top:10px;
	}


</style>



