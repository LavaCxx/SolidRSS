import { createEffect, createSignal, equalFn, For, onMount,Show } from "solid-js"
import Dropdown from "~/components/Dropdown";
import Item from './Item'
import { useStore } from "~/store"
import { useParams } from "@solidjs/router";
import { useNavigate } from "@solidjs/router"
import type { MenuItem } from './types'
import FolderModal from "./FolderModal";
import bus from '~/utils/bus'

type CountObj = {
    [key: string]: number
}
import { useLocation } from "@solidjs/router";
export default () => {
    let folderRef:HTMLElement|undefined
    const state=useStore()
    const navigate = useNavigate()
    const location = useLocation();
    const params = useParams();
    const [menu, setMenu] = createSignal<MenuItem[]>([
        {
            type: 'button',
            icon: 'i-mdi-format-list-bulleted',
            title: '全部文章',
            count: 0,
            link:'/',
            click: () => {
                navigate('/')
            }
        },
        {
            type: 'button',
            icon: 'i-mdi-clock-plus-outline',
            title: '稍后阅读',
            link:'/later',
            click: () => {
                navigate('/later')
            }
        }
    ],{equals:false})
    const [feeds, setFeeds] = createSignal<MenuItem[]>([])

    const confirmFolder=(data)=>{
        const id = window.$uuid.create(data)
        useStore(state=>state.incFeed({id,type:'folder',title:data}))
        folderRef.close()
    }

    const updateFeeds = async () => {
        const feeds = state().feeds
        const posts=state().posts
        let total=0
        let laterNum=0
        const countObj:CountObj={}
        posts.forEach(v=>{
            if(!v.isRead){
                if(!Reflect.has(countObj,v.feedId)) countObj[v.feedId]=0
                countObj[v.feedId]+=1
                total++
            }
            if(v.isLater) laterNum++
        })
        // const list = await window.$db.read('feeds')
        const res=feeds.map((v:any)=>(
            {
                ...v,
                count:countObj[v.id]||0,
            }
        ))
        setFeeds(res)
        updateMenu(total,laterNum)
    }
    bus.on('updatePost',()=>{
        updateFeeds()
    })
    bus.on('updateFeed',()=>{
        updateFeeds()
    })
    const updateMenu=(total:number,laterNum:number)=>{
        setMenu((prev)=>{
            const [m1,m2]=prev
            m1.count=total
            m2.count=laterNum
            return [{...m1},{...m2}]
        })
    }

    onMount( async ()=>{
        updateFeeds(params.postId)
    })
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
                    {(item) => <Item {...item} isActive={location.pathname===item.link} />}
                </For>
            </section>
            <section>
                <div class="flex justify-between items-center text-sm">
                    <h3>订阅源</h3>
                    <div class="flex gap-x-1 text-base">
                        <Dropdown button={<div class="i-mdi-plus" />}>
                            <li><a href="/append">订阅</a></li>
                            <li onClick={()=>{folderRef?.showModal()}}>文件夹</li>
                        </Dropdown>
                        <div class="i-mdi-dots-horizontal" />
                    </div>
                </div>
                    <div class="flex flex-col gap-y-1 py-2">
                    <For each={feeds()}>
                        {(item) => <Item {...item} isActive={params.feedId===item.id}  />}
                    </For>
                    </div>
            </section>
            <FolderModal ref={folderRef} onConfirm={confirmFolder} />
        </div>
    )
}