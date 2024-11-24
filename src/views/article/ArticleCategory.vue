<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import {ref} from 'vue'

const categorys = ref([
  {
    "id": 3,
    "categoryName": "美食",
    "categoryAlias": "my",
    "createTime": "2023-09-02 12:06:59",
    "updateTime": "2023-09-02 12:06:59"
  },
  {
    "id": 4,
    "categoryName": "娱乐",
    "categoryAlias": "yl",
    "createTime": "2023-09-02 12:08:16",
    "updateTime": "2023-09-02 12:08:16"
  },
  {
    "id": 5,
    "categoryName": "军事",
    "categoryAlias": "js",
    "createTime": "2023-09-02 12:08:33",
    "updateTime": "2023-09-02 12:08:33"
  }
])
//声明一个异步的函数
import {articleCategoryListService,addArticleCategoryAddService,deleteArticleCategoryService} from '@/api/article.js'
import {ElMessage, ElMessageBox} from "element-plus";

const articleCategoryList = async () => {
  let result = await articleCategoryListService()
  categorys.value = result.data
}
//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const categoryModel = ref({
  categoryName: '',
  categoryAlias: ''
})
//添加分类表单校验
const rules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
  ],
  categoryAlias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
  ]
}
articleCategoryList()

//调用添加分类接口
const addCategory = async () => {
  //判断提交数据是否为空
  if (categoryModel.value.categoryName === '' || categoryModel.value.categoryAlias === '') {
    ElMessage.warning('请输入分类名称和别名')
    return
  }else
    //判断字符在2-10个字符之间
  if (!/^.{2,10}$/.test(categoryModel.value.categoryName)) {
    ElMessage.warning('分类名称要求2-10个字符之间')
    return
  }
  //调用接口
  let result = await addArticleCategoryAddService(categoryModel.value);
  ElMessage.success(result.msg ? result.msg : '添加成功')
  //关闭弹窗
  dialogVisible.value = false
  //刷新列表
  articleCategoryList()
}
//控制弹窗标题的展示
const title = ref('')
//展示编辑弹窗
const showDialog = (row) => {
  dialogVisible.value = true; title.value = '编辑分类'
  //数据拷贝
  categoryModel.value.categoryName = row.categoryName;
  categoryModel.value.categoryAlias = row.categoryAlias;
  //扩展id属性，转递给后台用于区分添加和编辑
  categoryModel.value.id = row.id
}
//编辑分类
const updateCategory = async () => {
  //判断提交数据是否为空
  if (categoryModel.value.categoryName === '' || categoryModel.value.categoryAlias === '') {
    ElMessage.warning('请输入分类名称和别名')
    return
  }else
  //判断字符在2-10个字符之间
  if (!/^.{2,10}$/.test(categoryModel.value.categoryName)) {
    ElMessage.warning('分类名称要求2-10个字符之间')
    return
  }
  //调用接口
  let result = await addArticleCategoryAddService(categoryModel.value);
  ElMessage.success(result.msg ? result.msg : '编辑成功')
  //关闭弹窗
  dialogVisible.value = false
  //刷新列表
  articleCategoryList()
}
//删除分类
const deleteCategory = (row) => {
  //提示框
  ElMessageBox.confirm(
      '确定要删除这条分类吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //调用接口
        let result = await deleteArticleCategoryService(row.id);
        ElMessage({
          type: 'success',
          message: '成功删除',
        })
        //刷新列表
        articleCategoryList()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <el-button type="primary" @click="dialogVisible = true;title='添加分类'">添加分类</el-button>
        </div>
      </div>
    </template>
    <el-table :data="categorys" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="title == '添加分类' ? addCategory(): updateCategory()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>