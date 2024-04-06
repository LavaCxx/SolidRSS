
import Item from "./Item";
import { useParams } from "@solidjs/router";
import { useStore } from "~/store";
import uuid from "~/utils/uuid"
import { onMount, createSignal, For, createEffect } from 'solid-js';
export default (props:any)=>{
        const [feeds,setFeeds]=createSignal(null)
        let state=useStore()
        const params = useParams();
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
            for(let i=0;i<res.length;i++){
                res[i].id=uuid.create(res[i].link)
            }
            console.log('res',res)
            setFeeds(res)
        }

        createEffect(()=>{
                getFeeds(props.subId)
        
            
        })
        return (
            <div class="overflow-y-auto flex flex-col gap-y-2">

           
            <For each={feeds()}>
                {(item)=><Item {...item} feedId={props.subId}  isActive={params.postId===item.id} />}
            </For>

            </div>
        )
}