import {md5} from 'js-md5'
import {useStore} from "~/store";

const create=(str: string)=> {
    return md5(str).substring(0, 10)
}
const check=async (type:string='posts',id:string)=>{
    const state = useStore()
    const list=state()[type]
    const res= list.findIndex((v:any)=>v.id===id)
    return res>=0
}

export default {
    create,
    check
}