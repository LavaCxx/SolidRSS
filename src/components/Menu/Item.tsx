import { Show, createSignal, For } from "solid-js"
import type { MenuItem } from './types'

export default function Item(props) {
    const [showFolder, setShowFolder] = createSignal(false)
    const showCount = (count: number | undefined) => {
        if (!count) return ''
        if (count > 999) {
            return `999+`
        } else {
            return count
        }
    }
    const toggleFolder = () => {
        setShowFolder(!showFolder())
    }

    const navigate = (e) => {
        if (props.click) {
            e.preventDefault()
            props.click()
        }
    }

    const FeedItem = (props: MenuItem) => {
        return (<a onClick={navigate} href={`/feed/${props.id}`} class={`w-full grid grid-cols-[25px_auto_40px] text-base gap-x-1 items-center rounded content-center cursor-pointer text-primary transition p-2 hover:bg-highlight ${props.isActive ? 'bg-highlight' : ''}`}>
            <div class="flex justify-start text-left">
                <Show when={(props.icon || '').indexOf('i-mdi-') === 0} fallback={<img src={props.icon} />}>
                    <div class={props.icon} />
                </Show>
            </div>
            <div class="w-full overflow-hidden whitespace-nowrap">
                <p class=" overflow-hidden text-ellipsis" title={props.title}>{props.title || ''}</p>
            </div>
            <div class="text-secondary text-sm text-right whitespace-nowrap">
                <Show when={Reflect.has(props, 'count')}>
                    <p>{showCount(props.count)}</p>
                </Show>
            </div>
        </a>)
    }

    return (
        <div>
            <Show when={props.type === 'folder'} fallback={<FeedItem {...props} />}>
                <>
                    <div class="w-full grid grid-cols-[25px_auto_40px] text-base gap-x-1 items-center rounded content-center cursor-pointer text-primary transition p-2 hover:bg-highlight">
                    <div class="flex justify-start text-left">
                        <div class='text-3xl i-mdi-menu-right' onClick={toggleFolder} />
                    </div>
                    <div class="w-full overflow-hidden whitespace-nowrap">
                        <p class=" overflow-hidden text-ellipsis" title={props.title}>{props.title || ''}</p>
                    </div>
                    <div class="text-secondary text-sm text-right whitespace-nowrap">
                        <p>{showCount(props.count)}</p>
                    </div>
                    </div>
                    <For each={props.subFeeds}>
                        {(subFeed) => <Item {...subFeed} />}
                    </For>
                </>
            </Show>


        </div>
    )
}