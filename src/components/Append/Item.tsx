import { useStore } from '~/store';
import {useNavigate} from '@solidjs/router'
import { onMount,createSignal,Show } from 'solid-js';
export default (props)=>{
    const navigate = useNavigate();
    const [isExists, setIsExists] = createSignal(false);
    const append = async() => {
        const id = window.$uuid.create(props.link)
        const isExists=await window.$uuid.check('feeds',id)
        if(isExists) return
        useStore(state=>state.incFeed({id, ...props}))
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
    console.log('props',props.image,)
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