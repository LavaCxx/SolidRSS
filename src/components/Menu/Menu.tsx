import { createEffect, createSignal, For, onMount,Show } from "solid-js"
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
                count:v.item.length,
                icon:v?.image?.url||''
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
                        <div class="dropdown">
                            <div tabindex="0" role="button" class="i-mdi-plus" />
                            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li><a href="/append">订阅</a></li>
                                <li><a href="/append">文件夹</a></li>
                            </ul>
                        </div>
                        <div class="i-mdi-dots-horizontal" />
                    </div>
                </div>

                    <For each={feeds()}>
                        {(item) => <Item {...item} isActive={params.subId===item.id}  />}
                    </For>
                

            </section>
        </div>
    )
}