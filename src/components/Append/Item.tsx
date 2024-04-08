import { useStore } from '~/store';
import {useNavigate} from '@solidjs/router'
import { onMount,createSignal,Show } from 'solid-js';
export default (props:any)=>{
    const navigate = useNavigate();
    const [isExists, setIsExists] = createSignal(false);
    const append = async() => {
        const id = window.$uuid.create(props.link)
        const isExists=await window.$uuid.check('feeds',id)
        if(isExists) return
        let {item,...pureFeed}=props
        useStore(state=>state.incFeed({id, ...pureFeed,unread:item.length}))
        item=item.map((v:any)=>{
            return {...v,feedId:id,isRead:false,isLater:false,id:window.$uuid.create(v.link),content:v['content:encoded']||''}
        })
        useStore(state=>state.incPost(item))
    }
    const getStatus=async (link:string)=>{
        const id = window.$uuid.create(link)
        const isExists=await window.$uuid.check('feeds',id)
        setIsExists(isExists)
        
    }
    const toFeed=()=>{
        const id = window.$uuid.create(props.link)
        navigate('/subscribe/'+id)
    }
    onMount(()=>{
        getStatus(props.link)
    })
    return (
        <div class="w-full rounded bg-mantle p-2 flex flex-col gap-y-1">
            <Show when={props.icon}>
            <img class="w-12" src={props.icon} alt={props.title} />
            </Show>
            
            <a href={props.link} target="_blank"><h3 class="font-bold text-primary">{props.title}</h3></a>
            <p class="text-secondary">{props.description}</p>
            <Show when={!isExists()} fallback={<button class="btn btn-primary" onClick={toFeed}>查看</button>}>
            <button class="btn btn-primary" onClick={append}>添加</button>
            </Show>
            
        </div>
    )
}