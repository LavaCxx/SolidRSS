import { ArticleData, extract } from '@extractus/article-extractor'
import { onMount, createSignal, For, createEffect } from 'solid-js';
import { useParams,useNavigate } from "@solidjs/router";
import { useStore } from '~/store';

export default function PostPage(props){
    const params = useParams();
    const state=useStore()
    const navigate = useNavigate();
    const [article,setArticle] = createSignal<ArticleData|null>(null)
    const fetchData = async (link:string) => {
        "use server";
        let res=null
        try{
            res =await extract(link)
        }catch(err){
            console.log(err)
        }
        return res
    }
    const getNewArticle = async (id:string) => {
        if(!id) return
        let link=state().posts.find(v=>v.id===id)?.link||''
        const res =await fetchData(link)
        console.log('res',res)
        setArticle(res)
    }
    createEffect(() => {
        getNewArticle(params.postId)
        console.log('params',params.postId)
    })
    return (
        <>
        <div class="post-content prose mx-auto">
            <div innerHTML={article()?.content}></div>
        </div>
        </>
    )
}