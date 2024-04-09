import './feeds.scss'
import Item from './Item'
import { useParams, useNavigate,useLocation } from "@solidjs/router";
import { useStore } from "~/store";
import Dropdown from '~/components/Dropdown';
import {For,createSignal,createEffect,Show} from 'solid-js'
export default () => {
    let state=useStore()
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const [feed, setFeed] = createSignal({})
    const [posts, setPosts] = createSignal([])
    const getPosts=(feedId:string)=>{
        let res:any
        const pathname = location.pathname
        const sources = state().posts
        if(sources.length===0) return
        if(pathname==='/'){
            setFeed({title:'全部文章'})
            res=sources.sort((a,b)=>new Date(b.pubDate).getTime()-new Date(a.pubDate).getTime())
        }else if(pathname==='/later'){
            setFeed({title:'稍后阅读'})
            res=sources.filter(v=>v.isLater).sort((a,b)=>new Date(b.pubDate).getTime()-new Date(a.pubDate).getTime())
        }else{
            setFeed(()=>state().feeds.find(v=>v.id===feedId))
           res=sources.filter(v=>v.feedId===feedId)
        }
        setPosts([...res])
    }
    createEffect(()=>{
        getPosts(params.feedId)
    })
    const deleteFeed=()=>{
        useStore(state=>state.delFeed(params.feedId))
        navigate('/subscribe')
    }
    return (
        <div class="pt-10 relative text-xl h-full">
        <header class="absolute w-full top-0 left-0 h-10 flex justify-between items-center bg-blank px-4 border-b-1 border-overlay">
            <div>{feed()?.title}</div>
            <div class="flex gap-x-4 text-2xl">
            <Show when={location.pathname==='/later'} fallback={<div class="i-mdi-check-all cursor-pointer" title="全部标记已读" />}>
            <div class="i-mdi-bookmark-off cursor-pointer" title="清除标记" />
                    </Show>
                    
                    <div class="i-mdi-refresh cursor-pointer" title="刷新" />
                    <Show when={Reflect.has(feed(),'id')}>
                    <div class="i-mdi-delete-outline color-warning cursor-pointer" title="删除" />
                    </Show>
                    
                </div>
        </header>
        <div class="feeds-grid h-full overflow-y-auto">
            <For each={posts()}>{(post) => <Item {...post} />}</For>
        </div>
        </div>
    )
}