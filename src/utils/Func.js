import Vue from 'vue'

Vue.prototype.convertTimeStampToDate = function(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate();
    return Y + M + D;
},

    //数组求和
Vue.prototype.countSum = function(arr) {
        var s = 0;
        arr.forEach(function(val, idx, arr) {
            s += val;
        }, 0);
        return s;
    }

//计算当前周数
Vue.prototype.functiontheWeek = function() {
    //判断本周是第几周
   var today = new Date();
   var firstDay = new Date(today.getFullYear(), 0, 1);
   var dayOfWeek = firstDay.getDay();
   var spendDay = 1;
   if (dayOfWeek != 0) {
		spendDay = 7 - dayOfWeek + 1;
   }
   firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
   var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
   var result = Math.ceil(d / 7);
   return result + 1;
}

//数组去重
Vue.prototype.removeDuplicatedItem = function(ar) {
    var ret = [];
    for (var i = 0, j = ar.length; i < j; i++) {
        if (ret.indexOf(ar[i]) === -1) {
            ret.push(ar[i]);
        }
    }
    return ret;
}


Vue.prototype.getStdTime = function(time) {
    var d = new Date(time);
    var endTime =
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
        '-' +
        (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
    return endTime;
}