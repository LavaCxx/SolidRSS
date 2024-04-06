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
        const description= props.description as string
        let res = description.match(bannerReg)
        
        return res?.[0]
    }
    const getPureDescription = (desc:string) => {
        return desc.replace(/<.*>/g,'')
    }
    let bannerUrl: string = getBanner() || ''
    const toPost=async ()=>{
        let id:string=props.id
        const isExist=await window.$uuid.check('posts',id)
        console.log('isExist',isExist)
        if(!isExist){
            useStore(state=>state.incPost({...props}))
        }
        navigate(`/subscribe/${props.feedId}/post/${id}`)

        // useStore.
    }
    // href={`/subscribe/${params.subId || 'all'}/post/${props.id}`}
    return (
        <div onClick={toPost} class={`flex h-36 w-full flex-col text-sm gap-y-1  cursor-pointer text-primary px-4 py-3 rounded hover:bg-highlight transition  ${props.isActive ? 'bg-highlight' : ''}`}>
            <div class="w-full gap-x-2">
                <div class=" flex-shrink-0 flex-col gap-y-1">
                <Show when={bannerUrl}>
                    <div class="float-right ml-2 mb-2 w-3/10 h-18   rounded overflow-hidden bg-center bg-cover bg-no-repeat bg-overlay" style={{ 'background-image': `url(${bannerUrl})` }} />
                </Show>
                    <h3 class="text-primary text-sm font-bold">{props.title}</h3>
                    <p class="text-secondary mt-1 text-xs">{dayjs(props.pubDate).format('YY年MM月DD日')}</p>
                    <p class="text-secondary mt-1 text-xs line-clamp-3">{getPureDescription(props.description)}</p>
                </div>


            </div>
            <div>
                
            </div>
        </div>
    )
}