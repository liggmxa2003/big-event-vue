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


// 更新密码
import {updatePasswordService} from "@/api/user.js";
import router from "@/router/index.js";
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
  //跳转登录页面
  router.push('/login')
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
            <el-input v-model="userInfo.old_pwd" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="userInfo.new_pwd" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password">
            <el-input v-model="userInfo.re_pwd" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePassword">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
