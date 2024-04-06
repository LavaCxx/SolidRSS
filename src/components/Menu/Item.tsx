import { Show } from "solid-js"
import type { MenuItem } from './types'
import {useStore} from "~/store"

export default (props: MenuItem) => {
    const showCount = (count: number | undefined) => {
        if (!count) return ''
        if (count > 999) {
            return `999+`
        } else {
            return count
        }
    }
    const navigate = (e)=>{
       
        useStore.setState({currentFeed:props})
        if(props.click){
            e.preventDefault()
            props.click()
        }
        
    }
    return (
        <a onClick={navigate} href={`/subscribe/${props.id}`} class={`w-full grid grid-cols-[20px_auto_40px] text-sm gap-x-1 items-center rounded content-center cursor-pointer text-primary transition p-1 hover:bg-highlight ${props.isActive?'bg-highlight':''}`}>
            <div class="flex justify-start text-base text-left">
                <Show when={(props.icon||'').indexOf('i-mdi-') === 0} fallback={<img src={props.icon} />}>
                    <div class={props.icon} />
                </Show>
            </div>
            <div class="w-full overflow-hidden whitespace-nowrap">
                <p  class=" overflow-hidden text-ellipsis" title={props.title}>{props.title || 'test'}</p>
            </div>
            <div class="text-secondary text-xs text-right whitespace-nowrap">
                <Show when={Reflect.has(props, 'count')}>
                    <p>{showCount(props.count) || 0}</p>
                </Show>
            </div>
        </a>
    )
}