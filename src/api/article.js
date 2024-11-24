import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js';
//文章分类列表查询
export const articleCategoryListService = ()=>{
    return request.get('/category');
}

//添加文章分类
export const addArticleCategoryAddService = (categoryData)=>{
    return request.post('/category',categoryData);
}
//删除文章分类
export const deleteArticleCategoryService = (id)=>{
    return request.delete('/category?id='+id);
}
//文章列表查询
export const articleListService = (params)=>{
    return request.get('/article',{params:params});
}
