import axios from 'axios';

let base = '';

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};
export const uploadFileRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};
export const deleteRequest = (url) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`
    });
};
export const getRequest = (url) => {
    return axios({
        method: 'get',
        url: `${base}${url}`
    }).catch(function (err) {
        var errInfo = err.response['data'];
        console.log(errInfo);
        if(errInfo['status']!=200){
            if(errInfo['message'].indexOf('未登录')!=-1){
                sessionStorage.removeItem("user");
                location.href = location.origin+"/#/login";
            }else{
                alert(errInfo['message']);
            }
        }
        //return ret
    });
};
