<template>
	<section>
		<!--工具条-->
		<el-col :span="24" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!--<el-form-item>-->
					<!--<el-input v-model="filters.name" placeholder="姓名"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item>-->
					<!--<el-button type="primary" v-on:click="getUserByName">查询</el-button>-->
				<!--</el-form-item>-->
				<el-form-item>
					<el-button class="add_btn" @click="handleUpdate">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-button class="add_btn" @click="educe">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>



        <el-dialog title="新增/修改用户权限" v-model="authFormVisible">
            <template>
                <el-transfer v-model="auths" :data="authData"
                             filterable
                             :titles="['所有权限', '用户已有权限']"
                ></el-transfer>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="authFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserAuth">确 定</el-button>
            </div>
        </el-dialog>



		<el-dialog title="新增/修改" v-model="dialogFormVisible">
			<el-form v-model="form">
				<el-form-item  v-if="formType=='add'" label="工号" :label-width="formLabelWidth">
					<el-input v-model="form.eid" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="姓名" :label-width="formLabelWidth">
					<el-input v-model="form.username" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item v-if="formType=='add'" label="密码" :label-width="formLabelWidth">
					<el-input v-model="form.password" value=""  auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="电话" :label-width="formLabelWidth">
					<el-input v-model="form.mobile" auto-complete="off"></el-input>
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



		<!--列表-->
		<template>
			<el-table :data="users"  border stripe highlight-current-row style="width: 100%;">
				<!--<el-table-column type="index">-->
				<!--</el-table-column>-->
				<el-table-column prop="username" label="姓名" sortable :width="200">
				</el-table-column>
				<el-table-column prop="eid" label="工号" :width="200">
				</el-table-column>
				<el-table-column prop="mobile" label="电话" :width="200">
				</el-table-column>
				<el-table-column prop="email" label="邮箱" :width="200">
				</el-table-column>
				<el-table-column prop="status" label="状态" :formatter="formatSta" :width="150">
				</el-table-column>
				<el-table-column  operation="操作"  label="操作">
					<template slot-scope="scope">
						<!-- <el-button  size="small"  @click="goDetail(scope.$index, scope.row)">详情 </el-button> -->
						<el-button  size="small"  @click="handleUpdate(scope.$index, scope.row)">编辑 </el-button>
                        <el-button  size="small"  @click="handleRole(scope.row)">用户权限 </el-button>
						<!--<el-button  size="small" type="danger" @click="handleShutOn(scope.$index,scope.row)">启停</el-button>-->
						<el-button  size="small"  type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--分页-->
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
		</template>



	</section>
</template>
<script>

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      form: {},
      formLabelWidth: "100px", //添加数据弹框label标签宽度
      dialogFormVisible: false, //控制添加数据的弹框显示关闭
      authFormVisible:false,
      total: 0,
      pageNum: 1,
      currentPager: 1,
      pageSize: 10,
      loading: false,
      users: [],
      authData:[],
      auths:[],
      filterUsers: [],
      formType: "",
      row: {},
      idx: 0,
      userList: [],
      auth_user:'',
      educeUsers:[]
    };
  },
  methods: {
    formatSta: function(row, column) {
      return row.status == -1 ? "注销" : row.status == 1 ? "正常" :  row.status == 0 ? "禁用" : "未知";
    },
    goDetail(index, row) {
      this.$router.push({name: "userDetail", params: { userNumber: row.id }});
    },
    educe() {
        var that = this;

      that.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function(){
          that.getRequest("/sys/user/download").then(function (response) {
              console.log(response);
              that.educeUsers = response.data.data;
              that.export2Excel();
          }).catch(function(error) {
              console.log(error);
              that.showErrMsg("导出用户失败");
          });

        }).catch(function () {});
    },
    export2Excel() {
      var that = this;
      require.ensure([], function(){
          const { export_json_to_excel } = require("../../vendor/Export2Excel"); //这里必须使用绝对路径
          const tHeader = ["姓名", "工号", "电话", "邮箱"]; // 导出的表头名  username eid  tel  email  status
          const filterVal = ["username", "eid", "mobile", "email"]; // 导出的表头字段名
          const list = that.educeUsers;
          const data = that.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "人员管理"); // 导出的表格名称，根据需要自己命名
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    getUserByName(){
      console.log();
    },
    add() {
        var that = this;
        var status = that.form.status;

        if (that.formType == "add") {
          that.form.status = status ? 1 : 0;
          var params =JSON.stringify(that.form);
          that.postRequest("/sys/user/add",{user:params}).then(function (response) {
              console.log(response);
              if(response.data.code==0&&response.data.data!=null){
                  that.users = [];
                  that.getUser(1);
              }else{
                  that.showErrMsg("新增用户失败");
              }
          }).catch(function(error) {
              console.log(error);
              that.showErrMsg("新增用户失败");
          });
        } else if (that.formType == "update") {
          var params = JSON.stringify({id:that.form.id,username:that.form.username,status:0,mobile:that.form.mobile,email:that.form.email});
          that.postRequest("/sys/user/update",{user:params}).then(function (response) {
              console.log(response);
              if(response.data.code==0&&response.data.data!=null) {
                  that.users = [];
                  that.getUser(1);
              }else{
                  that.showErrMsg("编辑用户失败");
              }
          }).catch(function(error) {
              console.log(error);
              that.showErrMsg("编辑用户失败");
          });
        }
        that.dialogFormVisible = false;
        that.form = {};
    },
    handleSizeChange(page) {
        var that = this;
        that.pageNum = page;
        that.getUser(page);
    },
    //删除
    handleDelete(index, row) {
      console.log(row.id);
      var that = this;
      that.$confirm("删除该用户吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          //编辑保存
          that.getRequest("/sys/user/delete/"+row.id).then(function(response) {
              console.log(response);
              that.$message({
                  type: "success",
                  message: "删除成功!"
              });
              that.getUser(1);
          }).catch(function(err) {
              console.log(err);
              that.showErrMsg("删除失败!");
          });
        }).catch(function() {
          //编辑取消
          that.showErrMsg("已取消删除!");
        });
    },
    handleRole(row){
        var that = this;
        that.authFormVisible = true;
        that.getUserRole(row.id);
        that.auth_user = row.id;
    },
    addUserAuth(){
        var that = this;
        that.postRequest("/sys/user/role/addRoles",{roles:JSON.stringify(that.auths),uid: that.auth_user}).then(function(res) {
            if(res.data.code==0) {
                that.showErrMsg('保存用户权限成功','success');
            }
            that.authFormVisible = false;
        }).catch(function(err) {
            that.showErrMsg('保存用户权限失败');
        });

    },
      getUserRole(uid){
          var that = this;
          that.authData = [];
          that.auths = [];
          that.getRequest("/sys/user/role/getAllRole").then(function(response) {
              if(response.data.code==0&&response.data.data!=null){
                  var authDataList = response.data.data;
                  that.getRequest("/sys/user/role/getUserRole/"+uid).then(function(subres) {
                      if(subres.data.code==0&&subres.data.data!=null) {
                          for (var i = 0; i < authDataList.length; i++) {
                              var row = authDataList[i];
                              that.authData.push({key: row.rid, label: row.gname + " " + row.name, disabled: false});
                              for (var j = 0; j < subres.data.data.length; j++) {
                                  var sub_row = subres.data.data[j];
                                  if(row.gid==sub_row.gid&&row.rid==sub_row.rid){
                                      that.auths.push(row.rid);
                                      break;
                                  }
                              }
                          }
                      }else{
                          for (var i = 0; i < authDataList.length; i++) {
                              var row = authDataList[i];
                              that.authData.push({key: row.rid, label: row.gname + " " + row.name, disabled: false});
                          }
                      }
                  }).catch(function(err) {
                      that.showErrMsg('获取用户权限失败');
                  });
              }
          }).catch(function(err) {
              that.showErrMsg('获取用户权限失败');
          });

      },
    handleUpdate(index, row) {
      this.dialogFormVisible = true;
      if (typeof row != "undefined") {
        this.row = row;
        this.form = JSON.parse(JSON.stringify(row));
        this.form.status = this.form.status ? true : false;
        this.formType = "update";
      } else {
        this.formType = "add";
        this.form = { password: 111111,status:true};
      }
    },
    handleCurrentChange(page) {
      this.currentPager = page;
      this.getUser(page);
    },
    //获取用户列表
    getUser: function(page) {
        var that = this;
        var name = that.filters.name;
        let para = {name: name ? name : "", page: page, per: 10};
        that.loading = true;
        that.getRequest("/sys/user/list?page=" + para.page + "&size=" + para.per + "&name=" + para.name).then(function(response) {
          that.loading = false;
          if(response.data.data!= null){
              that.users = response.data.data.list;
              that.total = response.data.data.total;
              for (var j = 0; j < that.users.length; j++) {
                  var status = that.users[j].status;
                  that.users[j].statusName = status == -1 ? '注销' : status == 0 ? '禁用' : status == 1 ? '正常' : '未知';
              }
          }else{
              that.showErrMsg(response.data.message);
          }
        }).catch(function(err) {
          console.log(err);
          that.showErrMsg('获取用户列表失败');
        });
    },
    showErrMsg(err,type){
        type = type ? type : 'error';
        var that = this;
        that.loading = false;
        that.$message({
            message: err,
            type: type
        });
    },
    //判断月和日小于两位数，添加0
    mosaicData(data) {
      var date = data.split("-");
      date[1] = date[1].length == 1 ? "0" + date[1] : date[1];
      date[2] = date[2].length == 1 ? "0" + date[2] : date[2];
      return date.join("-");
    }
  },
  mounted() {
    //			this.getUser(1);
    this.dialogFormVisible = false;
  },
  //监听数据
  watch: {
    search: function(val) {
      //				this.handlersearch(val);
    },
    //			filterUsers(){
    //				this.handleCurrentChange(this.currentPager);
    //
    //			},
    tableData() {
      //				this.handlersearch(this.search);
    }
  },
  //初始化显示第一页数据
  created() {
    //			this.filterUsers = this.users;
    this.handleCurrentChange(1);
  }
};
</script>

<style scoped>
</style>