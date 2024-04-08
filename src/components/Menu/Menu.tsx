import { createEffect, createSignal, equalFn, For, onMount,Show } from "solid-js"
import Dropdown from "~/components/Dropdown";
import Item from './Item'
import { useStore } from "~/store"
import { useParams } from "@solidjs/router";
import { useNavigate } from "@solidjs/router"
import type { MenuItem } from './types'
import bus from '~/utils/bus'

type CountObj = {
    [key: string]: number
}

export default () => {
    const state=useStore()
    const navigate = useNavigate()
    const params = useParams();
    const [menu, setMenu] = createSignal<MenuItem[]>([
        {
            type: 'button',
            icon: 'i-mdi-format-list-bulleted',
            title: '全部文章',
            count: 0,
            click: () => {
                
                navigate('/subscribe/all')
            }
        },
        {
            type: 'button',
            icon: 'i-mdi-clock-plus-outline',
            title: '稍后阅读',
            click: () => {
                navigate('/subscribe/later')
            }
        }
    ],{equals:false})
    const [feeds, setFeeds] = createSignal<MenuItem[]>([])

    const updateFeeds = async () => {
        const feeds = state().feeds
        const posts=state().posts
        console.log('posts',posts)
        let total=0
        const countObj:CountObj={}
        posts.forEach(v=>{
            if(!v.isRead){
                if(!Reflect.has(countObj,v.feedId)) countObj[v.feedId]=0
                countObj[v.feedId]+=1
                total++
            }
        })
        console.log('countObj',countObj,total)
        // const list = await window.$db.read('feeds')
        const res=feeds.map((v:any)=>(
            {
                ...v,
                count:countObj[v.id]||0,
            }
        ))
        setFeeds(res)
        updateMenu(total)
    }
    bus.on('updatePost',()=>{
        updateFeeds()
    })
    const updateMenu=(total:number)=>{
        setMenu((prev)=>{
            const newAll=prev[0]
            newAll.count=total
            return [{...newAll},prev[1]]
        })
        console.log('menus',menu())
    }

    // onMount( async ()=>{
    //     updateFeeds(state().feeds)
    // })
    // createEffect(()=>{
    //     updateFeeds(state().feeds)
    // })
    
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