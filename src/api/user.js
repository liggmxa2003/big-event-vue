//导入request.js请求工具
import request from '@/utils/request.js'

//提供注册接口函数
export const userRegisterService = (registerData)=>{
    //使用URLSearchParams完成传递参数
    const  params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
	return request.post('user/register',params);
}
//提供登录接口函数
export const userLoginService = (loginData)=>{
    //使用URLSearchParams完成传递参数
    const  params = new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key]);
    }
	return request.post('user/login',params);
}
//获取用户信息接口
export const userInfoService = ()=>{
	return request.get('user/userInfo');
}
//修改用户信息接口
export const userInUpdateService = (userInfoData)=>{
    return request.put('user/update',userInfoData);
}
//头像修改
export const userAvatarUpdateService = (avatarUrl)=>{
    const params = new URLSearchParams()
    params.append('avatarUrl',avatarUrl);
    return request.patch('/user/updateAvatar',params);
}
//修改M密码
export const updatePasswordService = (pwdData)=>{
    return request.patch('/user/updatePwd',pwdData);
}