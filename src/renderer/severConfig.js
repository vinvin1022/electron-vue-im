import axios from 'axios';
import { Message } from 'element-ui';
import api from './api.js';
export const imagesUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/static/images`
  : `file://${__dirname}/static/images`;

/* export const config={
    webHost:'https://a.sxmaps.com/#/',
    host:"https://webapi.sxmaps.com",
    protocol:'https',
    version:'2.06',
} */
export const config={
    webHost:'http://192.168.74.34/#/',
    host:"http://192.168.74.33:80",
    protocol:'https',
    version:'2.06',
}

const $http=(url,params={})=>{
    let token=localStorage.token;
    return new Promise((resolve, reject) => {
        return axios({
            method: params.type || 'post',
            url: config.host+(api[url]||url),
            data: params.data,
            headers: {
                token: `${token}`
            },
        }).then((res)=>{
            if(res.status==200){
                if(res.data.ret===0||res.data.code==200) {
                    return resolve(res.data);
                }else if(res.data.ret === 900401){
                    if(res.data.data===40303){
                        Message.error('没有权限')
                        reject(res.data);
                    }else{
                        // window.location.href=window.location.origin+'#/login'
                        reject(res.data);
                    }
       
                }else{
                    Message.error(res.data.text || res.data.res_info||'接口请求错误')
                    reject(res.data)
                }
                
                
            }else{
                Message.error(res.data.text || res.data.res_info||'接口请求错误')
                reject(res.data)
            }
            
        }).catch((err)=>{
            Message.error(err.response.statusText || err.message||'接口请求失败')
            reject(err);
        });
    })
}

export default $http;