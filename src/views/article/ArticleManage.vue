<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'

import { ref, onMounted } from 'vue'

// 文章分类数据模型
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

// 用户搜索时选中的分类id
const categoryId = ref('')

// 用户搜索时选中的发布状态
const state = ref('')

// 文章列表数据模型
const articles = ref([])

// 分页条数据模型
const pageNum = ref(1) // 当前页
const total = ref(20) // 总条数
const pageSize = ref(3) // 每页条数

// 当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  articleList()
}

// 当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  articleList()
}

import {
  articleCategoryListService,
  articleListService,
  addArticleService,
  editArticleService,
  deleteArticleService
} from '@/api/article.js'

// 获取文章分类列表
const articleCategoryList = async () => {
  let result = await articleCategoryListService()
  categorys.value = result.data
}

// 获取文章列表数据
const articleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null
  }
  let result = await articleListService(params)
  // 渲染视图
  total.value = result.data.total
  articles.value = result.data.items
  // 根据分类id获取名称
  for (let i = 0; i < articles.value.length; i++) {
    for (let j = 0; j < categorys.value.length; j++) {
      if (articles.value[i].categoryId === categorys.value[j].id) {
        articles.value[i].categoryName = categorys.value[j].categoryName
      }
    }
  }
}

// 在组件挂载时调用获取分类和文章列表的方法
onMounted(() => {
  articleCategoryList()
  articleList()
})

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
// 控制抽屉是否显示
const visibleDrawer = ref(false)
// 添加表单数据模型
const articleModel = ref({
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: ''
})
// 清空表单
const resetForm = () => {
  articleModel.value = {
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: '',
    id: ''
  }
}

import { watch } from 'vue'

watch(visibleDrawer, (newVal) => {
  if (!newVal) {
    // 抽屉关闭时清空 QuillEditor 的内容
    articleModel.value.content = ''
  }
})

import { computed } from 'vue'
const isEditMode = computed(() => {
  return articleModel.value.id !== ''
})

// 导入token
import { useTokenStore } from '@/stores/token.js'
import {ElMessage, ElMessageBox} from 'element-plus'
const tokenStore = useTokenStore()

// 上传成功的回调函数
const uploadSuccess = (result) => {
  articleModel.value.coverImg = result.data
  console.log(result.data)
}

// 添加文章
const addArticle = async (clickState) => {
  // 把文章状态赋值给数据模型
  articleModel.value.state = clickState
  if (!articleModel.value.title || !articleModel.value.content || !articleModel.value.coverImg) {
    ElMessage.warning('请输入文章标题、内容、封面图')
    return
  }
  // 调用接口
  let result
  // 判断是否是编辑
  if (articleModel.value.id) {
    // 编辑文章
    result = await editArticleService(articleModel.value)
  } else {
    // 添加文章
    result = await addArticleService(articleModel.value)
  }

  ElMessage.success(result.msg ? result.msg : '操作成功')
  // 关闭弹窗
  visibleDrawer.value = false
  // 刷新列表
  articleList()
}
// 展示编辑文章
const showDialog = (row) => {
  // 展示弹窗
  visibleDrawer.value = true
  // 数据拷贝
  articleModel.value.title = row.title
  articleModel.value.content = row.content
  articleModel.value.coverImg = row.coverImg
  articleModel.value.state = row.state
  articleModel.value.categoryId = row.categoryId
  // 扩展 id 属性，传递给后台用于区分添加和编辑
  articleModel.value.id = row.id
}
//删除文章
const deleteArticle = async (row) => {
  // 弹窗询问
  let confirm = await ElMessageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  // 确认删除
  if (confirm) {
    // 调用接口
    let result = await deleteArticleService(row.id)
    // 刷新列表
    articleList()
  }
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true;resetForm()">添加文章</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId" style="width: 200px">
          <el-option
              v-for="c in categorys"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state" style="width: 200px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="articleList">搜索</el-button>
        <el-button @click="categoryId='';state=''">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>
    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" :title="articleModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
      <!-- 添加文章表单 -->
      <el-form :model="articleModel" label-width="100px">
        <el-form-item label="文章标题">
          <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select placeholder="请选择" v-model="articleModel.categoryId">
            <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章封面">
        <!--
        auto-upload:设置是否自动上
        action:上传地址，
        name:上传文件参数名，
        headers:上传请求头，
        on-success:设置上传成功的回调函数
        --->
          <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
          action="/api/upload"
          name="file"
          :headers="{'Authorization':tokenStore.token}"
          :on-success="uploadSuccess"
          >
            <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容">
          <div class="editor">
            <quill-editor
                theme="snow"
                v-model:content="articleModel.content"
                contentType="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addArticle(isEditMode ? '已发布' : '草稿')">{{ isEditMode ? '修改' : '发布' }}</el-button>
          <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
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

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>