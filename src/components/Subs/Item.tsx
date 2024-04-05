import { Show,createEffect } from "solid-js"
import type { SubItem } from './types'
import { useStore } from "~/store"
import { useNavigate, useParams } from "@solidjs/router"
import dayjs from 'dayjs'

export default (props: SubItem) => {
    const navigate = useNavigate()
    const state = useStore()
    const bannerReg = /(?<=img src=")(.+?)(?=")/

    const getBanner = () => {
        const { description } = props
        let res = description.match(bannerReg)
        
        return res?.[0]
    }
    const getPureDescription = (desc) => {
        return desc.replace(/<.*>/g,'')
    }
    let bannerUrl: string = getBanner() || ''
    const toPost=async ()=>{
        let id:string
        if(!props.id){
            id= window.$uuid.create(props.link)
            const isExist=await window.$uuid.check('posts',id)
            if(!isExist){
                useStore(state=>state.incPost({id, ...props}))
            }
        }else {
            id=props.id
        }

        console.log('id',props.link,window.$uuid.create(props.link))
        navigate(`/subscribe/${params.subId}/post/${id}`)

        // useStore.
    }
    // href={`/subscribe/${params.subId || 'all'}/post/${props.id}`}
    return (
        <div onClick={toPost} class="flex min-h-16 flex-col text-sm gap-y-1  cursor-pointer text-primary p-2 rounded hover:bg-highlight hover:text-blank">
            <div class="flex  justify-between gap-x-2">
                <div class="flex flex-col gap-y-1">
                    <h3 class="text-primary text-sm font-bold">{props.title}</h3>
                    <p class="text-secondary text-xs">{dayjs(props.pubDate).format('YY年MM月DD日')}</p>
                    <p class="text-secondary text-xs line-clamp-3">{getPureDescription(props.description)}</p>
                </div>
                <Show when={bannerUrl}>
                    <div class="max-w-16 h-12 flex-[0_0_30%] rounded overflow-hidden bg-center bg-cover bg-no-repeat" style={{ 'background-image': `url(${bannerUrl})` }}>
                    </div>
                </Show>

            </div>
            <div>

            </div>
        </div>
    )
}