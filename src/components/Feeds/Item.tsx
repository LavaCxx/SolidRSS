import "./feeds.scss"
import {Show, onMount} from "solid-js"
import { useStore } from "~/store"
import dayjs from 'dayjs'
import bus from "~/utils/bus"
export default (props)=>{
    const bannerReg = /(?<=img src=")(.+?)(?=")/
    const getBanner = () => {
        const description= props.description as string
        let res = description.match(bannerReg)
        return res?.[0]
    }
    const toggleLaterMark=async(e)=>{
        e.preventDefault()
        useStore((state)=>state.updatePost({...props,isLater:!props.isLater}))
    }
    const toPost=()=>{
        bus.emit('showPost',props)
    }
    let bannerUrl = getBanner()
    return <div class="feed-item h-90 relative border-1 border-primary rounded overflow-hidden bg-mantle" onselectstart="return false">
        <div class="h-80">
        <Show when={bannerUrl}>
                    {/* <div class="w-full h-40 overflow-hidden bg-center bg-cover bg-no-repeat bg-overlay" style={{ 'background-image': `url(${bannerUrl})` }} /> */}
                    <div class="overflow-auto w-full" onClick={toPost}>
                        <img src={bannerUrl} class="w-full h-50 object-cover" />
                    </div>
        </Show>
        <div class="p-2">
        <h3 onClick={toPost} class="cursor-pointer text-primary text-base font-bold line-clamp-2">{props.title}</h3>
        <a href={props.feedSource?.link} target="_blank" class="text-secondary text-sm">{props.feedSource?.name}</a>
        <Show when={!bannerUrl}>
            <p class="text-secondary mt-1 text-xs ">{props.description}</p>
        </Show>
        
        </div>
        
        </div>
        <div class="absolute bottom-0 left-0 w-full h-10 flex justify-between items-center p-2">
            <div>
            <p class="text-secondary mt-1 text-xs">{dayjs(props.pubDate).format('YY年MM月DD日')}</p>
            </div>
            <div>
            <div class={`text-2xl cursor-pointer text-primary ${props.isLater?'i-mdi-bookmark':'i-mdi-bookmark-outline'}`}  onClick={toggleLaterMark} />
            </div>
        </div>
    </div>
}