
import Item from "./Item";
import { useParams, useNavigate } from "@solidjs/router";
import { useStore } from "~/store";
import { onMount, createSignal, For, createEffect,Show } from 'solid-js';
import Dropdown from "~/components/Dropdown";
export default (props:any)=>{
        const [posts,setPosts]=createSignal(null)
        const [feedInfo,setFeedInfo]=createSignal({})
        let state=useStore()
        const navigate = useNavigate();
        const params = useParams();
        const getFeeds=(subId:string)=>{
            let res:any
            const sources = state().posts
            if(sources.length===0) return
            if(subId==='all'){
                res=sources.sort((a,b)=>new Date(b.pubDate).getTime()-new Date(a.pubDate).getTime())
            }else{
               res=sources.filter(v=>v.feedId===subId)
            }
            setPosts([...res])
        }
        const deleteFeed=()=>{
            useStore(state=>state.delFeed(params.subId))
            navigate('/subscribe')
        }

        createEffect(()=>{
                getFeeds(props.subId)
                setFeedInfo(state().currentFeed)
        })
        onMount(()=>{
            if(!state().currentFeed?.title){
                if(params.subId==='all'||!params.subId){
                    useStore.setState({currentFeed:{title:'全部文章',count:0}})
                }else{
                    let feed=state().feeds.find(v=>v.id===params.subId)
                    useStore.setState({currentFeed:feed})
                    setFeedInfo(state().currentFeed)
                }
                
            }
        })
        return (
            <div class="pt-14 h-full w-full relative p-2">
            <header class="w-full px-3 bg-mantle flex h-12 border-b-1 justify-between items-center absolute top-0 left-0">
                <div>
                    <h2>{feedInfo()?.title}</h2>
                </div>
                <div class="flex gap-x-2">
                    <div class="i-mdi-check-all"></div>
                    <Show when={params.subId&&params.subId!=='all'}>
                    <Dropdown button={<div class="i-mdi-dots-horizontal" />}>
                            <li class="flex flex-row items-center"><div class="i-mdi-refresh" /><a>刷新</a></li>
                            <li class="flex flex-row items-center" onClick={deleteFeed}><div class="i-mdi-delete-outline" /><a>删除</a></li>
                    </Dropdown>
                    </Show>
                </div>
            </header>
            <div class="flex flex-col gap-y-2 overflow-y-auto">
            
           
            <For each={posts()}>
                {(item)=><Item {...item} feedId={props.subId}  isActive={params.postId===item.id} />}
            </For>

            </div>
            </div>
        )
}