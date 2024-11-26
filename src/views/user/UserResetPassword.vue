<script setup>
import { ref } from 'vue'
import useUserInfoStore from "@/stores/userInfo.js";
import {ElMessage} from "element-plus";
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})
const rules = {

}
// 更新用户信息
import {userInUpdateService} from "@/api/user.js";

const updateUserInfo = async () => {
  // 调用接口
  if (!/^\S{5,10}$/.test(userInfo.value.nickname)) {
    ElMessage.warning('昵称必须是5-10位的非空字符串');
    return;
  }else
      //判断邮箱不为空，且格式正确
  if (userInfo.value.email === '') {
    ElMessage.warning('请输入用户邮箱');
    return;
  }else{
    //判断邮箱格式是否正确
    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(userInfo.value.email)) {
      ElMessage.warning('邮箱格式不正确');
      return;
    }
  }
  let result = await userInUpdateService(userInfo.value);
  // 判断用户名称是否5-10位
  // 提示
  ElMessage.success(result.message?result.message:'修改成功');
  //修改pinia中的数据
  userInfoStore.setInfo(userInfo.value)
}
// 更新密码
import {updatePasswordService} from "@/api/user.js";
const updatePassword = async () => {
  // 判断新密码是否为5-10位
  if (!/^\S{5,10}$/.test(userInfo.value.new_pwd)) {
    ElMessage.warning('新密码必须是5-10位的非空字符串');
    return;
  }
  // 判断两次密码是否一致
  if (userInfo.value.new_pwd !== userInfo.value.re_pwd) {
    ElMessage.warning('两次密码不一致');
    return;
  }
  // 调用接口
  let result = await updatePasswordService(userInfo.value);
  // 提示
  ElMessage.success(result.message?result.message:'修改成功');
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>修改密码</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="原始密码">
            <el-input v-model="userInfo.old_pwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="nickname">
            <el-input v-model="userInfo.new_pwd"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="email">
            <el-input v-model="userInfo.re_pwd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePassword">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>