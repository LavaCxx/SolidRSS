import { createEffect, createSignal, For, onMount,Show } from "solid-js"
import Dropdown from "~/components/Dropdown";
import Item from './Item'
import { useStore } from "~/store"
import { useParams } from "@solidjs/router";
import { useNavigate } from "@solidjs/router"
import type { MenuItem } from './types'
export default () => {
    const navigate = useNavigate()
    const params = useParams();
    const [menu, setMenu] = createSignal<MenuItem[]>([
        {
            type: 'button',
            icon: 'i-mdi-format-list-bulleted',
            title: '全部文章',
            count: 333333,
            click: () => {
                
                navigate('/subscribe/all')
            }
        },
        {
            type: 'button',
            icon: 'i-mdi-clock-plus-outline',
            title: '稍后阅读',
            count: 2,
            click: () => {
                navigate('/append')
            }
        }
    ])
    const [feeds, setFeeds] = createSignal<MenuItem[]>([])
    let state=useStore()
    const updateFeeds = async (list) => {
        const res=list.map(v=>(
            {
                ...v,
                count:v.item.length
            }
        ))
        setFeeds(res)
    }
    createEffect(()=>{
        updateFeeds(state().feeds)
    })
    console.log('state',state())
    
    return (
        <div class="flex flex-col gap-y-2">
            <header>
                <div class="i-mdi-menu" />
            </header>
            <section>
                <For each={menu()}>
                    {(item) => <Item {...item} />}
                </For>
            </section>
            <section>
                <div class="flex justify-between items-center text-sm">
                    <h3>订阅源</h3>
                    <div class="flex gap-x-1 text-base">
                        <Dropdown button={<div class="i-mdi-plus" />}>
                            <li><a href="/append">订阅</a></li>
                            <li><a href="/append">文件夹</a></li>
                        </Dropdown>
                        <div class="i-mdi-dots-horizontal" />
                    </div>
                </div>
                    <div class="flex flex-col gap-y-1 py-2">
                    <For each={feeds()}>
                        {(item) => <Item {...item} isActive={params.subId===item.id}  />}
                    </For>
                    </div>

            </section>
        </div>
    )
}