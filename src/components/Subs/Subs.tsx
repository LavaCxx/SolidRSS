
import Item from "./Item";

import { useStore } from "~/store";
import { onMount, createSignal, For, createEffect } from 'solid-js';
export default (props:any)=>{
        const [feeds,setFeeds]=createSignal(null)
        let state=useStore()

        const [currentFeedId,setCurrentFeedId]=createSignal('')
        const getFeeds=(subId:string)=>{
            let res
            const sources = state().feeds
            if(sources.length===0) return
            if(subId==='all'){
                let totals:any[]=[]
                
                sources.forEach(v=>{
                    totals.push(...v.item||[])
                })
                res=totals.sort((a,b)=>new Date(b.pubDate).getTime()-new Date(a.pubDate).getTime())
            }else{
               res=sources.find(v=>v.id===subId)?.item||[]
            }
            setFeeds(res)
        }
        createEffect(()=>{
            getFeeds(props.subId)
        })
        return (
            <div class="overflow-y-auto">

           
            <For each={feeds()}>
                {(item)=><Item {...item} feedId={props.subId}  />}
            </For>

            </div>
        )
}