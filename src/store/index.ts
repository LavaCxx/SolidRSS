import { createWithSignal } from 'solid-zustand';

type InitObject= {
    feeds:any[],
    posts:any[]
}

interface FeedStore {
    feeds:any[],
    posts:any[],
    currentFeed:Object,
    currentPost:Object,
    incFeed:(data:any)=>void,
    incPost:(data:any)=>void,
    init:(data:InitObject)=>void
}

export const useStore = createWithSignal<FeedStore>((set) => ({
    feeds:[],
    posts:[],
    incFeed:async (data)=>{
        await window.$db.add('feeds',data)
       return set(state=>({feeds:[...state.feeds,data]}))
    },
    incPost:async(data)=>{
        await window.$db.add('posts',data)
        return set(state=>({posts:[...state.feeds,data]}))
    },
    init:(data)=>set(state=>({feeds:[...data.feeds],posts:[...data.posts]})),
    currentFeed:{},
    currentPost:{}
}));