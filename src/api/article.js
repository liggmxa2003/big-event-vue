import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js';
//文章分类列表查询
export const articleCategoryListService = ()=>{
    //const tokenStore = useTokenStore();
    //return request.get('/category',{headers:{'Authorization':tokenStore.token}});
    return request.get('/category');
}

//添加文章分类
export const addArticleCategoryAddService = (categoryData)=>{
    return request.post('/category',categoryData);
}