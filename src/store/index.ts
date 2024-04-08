import { createWithSignal } from 'solid-zustand';
import bus from "~/utils/bus"
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
    updatePost:(data:any)=>void,
    toggleRead:(id:string)=>void,
    decRead:(id:string)=>void,
    delFeed:(id:string)=>void,

    toggleLater:(id:string)=>void,
    init:(data:InitObject)=>void
}

export const useStore = createWithSignal<FeedStore>((set) => ({
    feeds:[],
    posts:[],
    incFeed:async (data)=>{
        if(Array.isArray(data)){
            for(let i=0;i<data.length;i++){
                await window.$db.add('feeds',data[i])
            }
            return set(state=>({feeds:[...state.feeds,[...data]]}))
        }else{
            await window.$db.add('feeds',data)
            return set(state=>({feeds:[...state.feeds,data]}))
        }
        
      
    },
    incPost:async(data)=>{
        if(Array.isArray(data)){
            for(let i=0;i<data.length;i++){
                await window.$db.update('posts',data[i])
            }
            set(state=>({posts:[...state.posts,...data]}))
            bus.emit('updatePost')
        }else{
            await window.$db.update('posts',data)
            set(state=>({posts:[...state.posts,data]}))
            bus.emit('updatePost')
        }
        setTimeout(()=>{
            
        })
        

    },
    decRead:async(id:string)=>{
        return set(state=>{
            let feeds=state.feeds.map(v=>{
                if(v.id===id) return {...v,unread:Math.max(v.unread-1,0)}
                return v
            })
            return {feeds}
        })  
    },
    toggleRead:async(id:string)=>{
        return set(state=>{
            let posts=state.posts.map(v=>{
                if(v.id===id) return {...v,isRead:!v.isRead}
                return v
            })
            return {posts}
        })
    },
    toggleLater:async(id:string)=>{
        return set(state=>{
            let posts=state.posts.map(async v=>{
                if(v.id===id){
                    await window.$db.update('posts',{...v,isLater:!v.isLater})
                    return {...v,isLater:!v.isLater}
                }
                return v
            })
            return {posts}
        })
    },
    updatePost:async (data:any)=>{
        await window.$db.update('posts',data)
        set(state=>{
            let posts=state.posts
            
            return {posts:posts.map(v=>{
                if(v.id===data.id) return data
                return v
            })}
        })
        bus.emit('updatePost')
    },
    delFeed:async (id:string)=>{
        await window.$db.deleteFeed(id)
        set(state=>({feeds:state.feeds.filter(v=>v.id!==id),posts:state.posts.filter(v=>v.feedId!==id)}))
        bus.emit('updatePost')
    },
    init:(data)=>{set(state=>({feeds:[...data.feeds],posts:[...data.posts]}))},
    currentFeed:{},
    currentPost:{}
}));