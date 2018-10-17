<template  >
	<section class="">
		<div>
			<el-row align="middle" :gutter="20" type="flex">
				<el-col :span="16">
				</el-col>
				<el-col :span="8">
					<el-button class="add_btn" @click="showDetail('','add')" :disabled="!isShowAdd">新增</el-button>
				</el-col>
			</el-row>
		</div>
		<el-row :gutter="10">
			<el-col :xs="9" :sm="7" :md="6" :lg="6" v-for="item in projectInfoLists" v-bind:key="item.proTimeWeek">
				<el-card shadow="hover">
					<div class="el-card-list">
						<div class="proTimeWeek">第{{item.proTimeWeek}}周</div>
						<ul class="partake">
							<li v-for="proName in item.proList" v-bind:key="proName.proGid">
								<div>
									<span>参与项目：</span>
									<strong>{{proName.gname}}</strong>
								</div>
								<div>
									<span>投入百分比：</span>
									<strong>{{proName.totalPer}}%</strong>
								</div>
								<ul>
									<span>已完成需求：</span>
									<div></div>
									<li v-for="(value,index) in proName.proDetail " v-bind:key="index">
										{{index+1}}：{{value.title}}
									</li>
								</ul>
							</li>
						</ul>
					</div>
					<div class="lookMore">
						<span @click="showDetail(item,'')">查看详情</span>
					</div>
				</el-card>
			</el-col>
		</el-row>

	</section>

</template>
<style>
.el-card {
	padding: 10px;
}

.el-card .el-card__body .el-card-list {
	height: 270px;
	overflow-y: scroll;
	overflow-x: hidden;
}
.el-col {
	margin-top: 10px;
}
/* for Chrome */
.el-card-list::-webkit-scrollbar {
	display: none;
}
ul {
	padding-left: 0;
}
ul li {
	list-style: none;
}
.el-card__body {
	padding: 10px;
}
.proTimeWeek {
	font-size: 16px;
	font-weight: bold;
}
.partake span {
	font-size: 14px;
	font-weight: bold;
}
.lookMore {
	text-align: right;
}
.lookMore span:nth-child(1) {
	display: inline-block;
	margin-right: 10px;
}
.lookMore span {
	display: inline-block;
	color: blue;
	border: 1px solid #f2f2f2;
	padding: 5px;
	border-radius: 5px;
}
</style>
<script>
export default {
	data() {
		return {
			userInfo: JSON.parse(sessionStorage.getItem('user')).data,
			projectInfoLists: [],
			isShowAdd: false,
		};
	},
	methods: {
		showDetail: function(item, flag) {
			if (flag == 'add') {
				this.$router.push({
					name: '工时详情',
					params: { proTimeWeek: this.functiontheWeek(), flag: 'add' },
				});
			} else {
				this.$router.push({
					name: '工时详情',
					params: { proTimeWeek: item.proTimeWeek },
				});
			}
		},
		getAllList: function() {
			var that = this;
			that
				.getRequest('/oy/task/getAllList/' + that.userInfo.id)
				.then(function(response) {
					if (response.data.code == 0 && response.data.data != null) {
						if (JSON.stringify(response.data.data) == '{}') {
							that.isShowAdd = true;
						} else {
							var obj = {};
							for (var i in response.data.data) {
								obj = {
									proTimeWeek: i,
									projectInfo: response.data.data[i],
									proList: [],
								};
								that.projectInfoLists.unshift(obj);
							}
							for (var i = 0; i < that.projectInfoLists.length; i++) {
								let itemList = that.projectInfoLists[i];
								let item = that.projectInfoLists[i].projectInfo;
								if (itemList.proTimeWeek.indexOf(that.functiontheWeek()) == -1) {
									that.isShowAdd = true;
								} else {
									that.isShowAdd = false;
								}
								for (var j in item) {
									let arr = [];
									for (var k = 0; k < item[j].length; k++) {
										arr.push(item[j][k].per);
									}
									that.countSum(arr);
									let par = {
										proGid: j,
										gname: item[j][0].gname,
										proDetail: item[j],
										totalPer: that.countSum(arr),
									};
									that.projectInfoLists[i].proList.push(par);
								}
							}
						}
					}
					that.loading = false;
				})
				.catch(function(err) {
					console.log(err);
					that.loading = false;
				});
		},
	},
	created: function() {
		this.getAllList();
	},
};
</script>
