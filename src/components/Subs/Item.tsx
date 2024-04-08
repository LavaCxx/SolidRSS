import { Show } from "solid-js"
import type { SubItem } from './types'
import { useStore } from "~/store"
import { useNavigate } from "@solidjs/router"
import dayjs from 'dayjs'
import './item.scss'

export default (props: SubItem) => {
    const navigate = useNavigate()
    const bannerReg = /(?<=img src=")(.+?)(?=")/
    const getBanner = () => {
        const description= props.description as string
        let res = description.match(bannerReg)
        
        return res?.[0]
    }
    const getPureDescription = (desc:string='') => {
        return desc.replace(/<.*>/g,'')
    }
    let bannerUrl: string = getBanner() || ''
    const toPost= ()=>{
        navigate(`/subscribe/${props.feedId}/post/${props.id}`)
    }

    const toggleLaterMark=async(e)=>{
        e.preventDefault()
        useStore((state)=>state.updatePost({...props,isLater:!props.isLater}))
    }
    return (
        <div class={`subscribe-item flex h-40 w-full flex-col text-sm gap-y-1  cursor-pointer text-primary px-4 py-3 rounded justify-between  hover:bg-highlight transition ${props.isActive ? 'bg-highlight' : ''}`}>
            <div class={`w-full gap-x-2 ${props.isRead ? '' : 'status-unread'}`}  onClick={toPost} >
                <div class=" flex-shrink-0 flex-col gap-y-1">
                <Show when={bannerUrl}>
                    <div class="float-right ml-2 mb-2 w-3/10 h-18   rounded overflow-hidden bg-center bg-cover bg-no-repeat bg-overlay" style={{ 'background-image': `url(${bannerUrl})` }} />
                </Show>
                    <h3 class="text-primary text-sm font-bold line-clamp-2">{props.title}</h3>
                    <p class="text-secondary mt-1 text-xs">{dayjs(props.pubDate).format('YY年MM月DD日')}</p>
                    <p class="text-secondary mt-1 text-xs line-clamp-3">{getPureDescription(props.description)}</p>
                </div>
            </div>
            <div class="flex">
                {/* <input type="radio" name="radio-1" class="radio radio-sm" /> */}
                <div class={`text-2xl ${props.isLater?'i-mdi-bookmark':'i-mdi-bookmark-outline'}`}  onClick={toggleLaterMark} />
                {/* {props.isLater?'稍后读':'不是'} */}
            </div>
        </div>
    )
}