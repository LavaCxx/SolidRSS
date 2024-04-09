import { ArticleData, extract } from '@extractus/article-extractor'
import { createMemo, createSignal, Show, createEffect, on } from 'solid-js'
import { useParams } from "@solidjs/router"
import { useStore } from '~/store'
import bus from '~/utils/bus'

export default function PostPage() {
    const params = useParams()
    const postId = createMemo(() => params.postId)
    const state = useStore()
    const [isLoading, setIsLoading] = createSignal(false)
    const [failMsg,setFailMsg] = createSignal('')
    const [article, setArticle] = createSignal<ArticleData | null>(null)
    const fetchData = async (link: string) => {
        "use server"
        let res = null
        try {
            res = await extract(link,{},{
                headers:{
                    'Cookie':'NEXT_LOCALE=zh'
                }
            }) || {}
        } catch (err) {
            console.log(err)
        }
        console.log('res2',res)
        return res
    }
    const getArticle = async (id: string) => {
        setIsLoading(true)
        if (!id) return
        let res={}
        let post = state().posts.find(v => v.id === id)
        if (!post){
            setFailMsg('文章获取失败，请稍后重试')
            setTimeout(()=>{
                setIsLoading(false)
            },250)
           
             return
        }
        if (post['content:encoded']) {
            res.content = post['content:encoded']
        } else if(post?.description){
            res.content =post.description
        }else{
            res = await fetchData(post.link)
            if(!res){
                setFailMsg('文章获取失败，请稍后重试')
            }else{
                res.content = res?.content || ''
            }
        }
        useStore(state => state.updatePost({...post,isRead:true }))
        // useStore(state=>state.decRead(id))
        setArticle(res)
        setIsLoading(false)
        
        

    }

    createEffect(on(postId, (id) => (
        getArticle(id)
    ),{defer:false}))
    const loadingContent = () => {
        return (<div class="w-full h-full flex justify-center items-center">
            <span class="loading loading-infinity loading-lg"></span>
        </div>)
    }

    return (
        <>
            <div class="post-content prose prose-primary mx-auto h-full">
                <Show when={!isLoading()} fallback={loadingContent()}>
                    <div innerHTML={article()?.content || '<div />'}></div>
                </Show>
                <Show when={failMsg()&&!isLoading()}>
                    <div class="w-full h-dvh flex justify-center items-center">
                        <p>{failMsg()}</p>
                    </div>
                </Show>
            </div>
        </>
    )
}