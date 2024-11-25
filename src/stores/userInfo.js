import {defineStore} from 'pinia'
import {ref} from 'vue'
//存储用户信息
const useUserInfoStore = defineStore('userInfo', ()=>{
    const info = ref({})

    /**
     * 设置信息函数
     * 该函数用于更新info对象的value属性值
     * 主要用途是在需要的地方调用该函数，以新的信息替换旧的信息
     *
     * @param {any} newInfo - 新的信息值，可以是任何类型的值
     */
    const setInfo = (newInfo)=>{
        info.value = newInfo
    }

    /**
     * 重置信息对象
     * 此函数将信息对象设置为空对象，用于在不再需要保留当前信息时清除信息对象的内容
     */
    const removeInfo = ()=>{
        info.value = {}
    }

    /**
     * 返回一个包含信息操作方法的对象
     * 这个对象提供了访问和操作信息的方法
     */
    return {info,setInfo,removeInfo}
// 保持状态，确保在组件生命周期内数据不会丢失
},{persist:true})

export default useUserInfoStore;