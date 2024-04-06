import { ArticleData, extract,addTransformations } from '@extractus/article-extractor'
import { onMount, createSignal, Show, createEffect,onCleanup } from 'solid-js';
import { useParams, } from "@solidjs/router";
import { useStore } from '~/store';

export default function PostPage(){
    let posts=[]
    const params = useParams();
    const state=useStore()
    const [isLoading,setIsLoading] = createSignal(false)
    const [article,setArticle] = createSignal<ArticleData|null>(null)
    const fetchData = async (link:string) => {
        "use server";
        let res={}
        try{
            res =await extract(link)||{}
        }catch(err){
            res={}
            console.log(err)
        }
        return res
    }
    const getArticle = async (id:string) => {
        setIsLoading(true)
        if(!id) return
        let res:any
        let post =state().posts.find(v=>v.id===id)
        if(!post) return
        if(post?.content){
            res=post
        }else{
            res =await fetchData(post.link)
            res.content=res?.content||''
        }
        window.$db.update('posts',{...post,...res})
        // await updateStore({...post,...res})
        // useStore(state=>state.updatePost({...post,...res}))

        setArticle(res)
        setIsLoading(false)
    }
    createEffect(() => {
        getArticle(params.postId)
    })
    const loadingContent=()=> {
        return (<div class="w-full h-dvh flex justify-center items-center">
            <span class="loading loading-infinity loading-lg"></span>
        </div>)
    }

    return (
        <>
        <div class="post-content prose prose-primary mx-auto h-full">
            <Show when={!isLoading()} fallback={loadingContent()}>
            {/* {loadingContent()} */}
                <div innerHTML={article()?.content||'<div />'}></div>
            </Show>
        </div>
        </>
    )
}