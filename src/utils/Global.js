const jobOpts =[{
    value: '1',
    label: '项目经理'
}, {
    value: '2',
    label: '开发'
}, {
    value: '3',
    label: '测试'
}, {
    value: '4',
    label: '运营'
}];

const proStatusOpts = [{
    value: '1',
    label: '未立项'
}, {
    value: '2',
    label: '已立项'
}, {
    value: '3',
    label: '开发中'
}, {
    value: '4',
    label: '开发完成'
}];

//问题优先级
const demandPriorityOpts = [
    { value: 9, label: "极高" },
    { value: 3, label: "高" },
    { value: 2, label: "低" },
    { value: 1, label: "极低" }];

//const demandPriorityOpts = [
//    { key: 9, value: "极高" },
//    { key: 3, value: "高" },
//    { key: 2, value: "低" },
//    { key: 1, value: "极低" }];

// 需求问题状态
const  demandStatusOpts = [
    { value: 0, label: "未开始" },
    { value: 1, label: "开发中" },
    { value: 2, label: "测试中" },
    { value: 3, label: "已完成" },
    { value: 4, label: "已验收" }];

export default {
    jobOpts,
    proStatusOpts,
    demandPriorityOpts,
    demandStatusOpts
}

function convertTimeStampToDate(timestamp){
    var date = new Date(timestamp);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    return Y+"-"+M+"-"+D;
}