import { extract } from '@extractus/article-extractor'
import { createMemo, createSignal, Show, createEffect, on } from 'solid-js'
import { useParams } from "@solidjs/router"
import { useStore } from '~/store'
import bus from '~/utils/bus'
import Toc from './Toc'
import {
    renderToString,
    renderToStringAsync,
    renderToStream
  } from "solid-js/web";

export default function PostPage(props) {
    const postId = createMemo(() => props.id)
    let postContent: HTMLDivElement|undefined
    const state = useStore()
    const [isLoading, setIsLoading] = createSignal(false)
    const [failMsg, setFailMsg] = createSignal('')
    const [article, setArticle] = createSignal<any>({})
    const [toc, setToc] = createSignal<any>([])
    const fetchData = async (link: string) => {
        "use server"
        let res = null
        try {
            res = await extract(link, {}, {
                headers: {
                    'Cookie': 'NEXT_LOCALE=zh'
                }
            }) || {}
        } catch (err) {
            console.log(err)
        }
        return res
    }
    const getArticle = async (id: string) => {
        setIsLoading(true)
        if (!id) return
        let post = state().posts.find(v => v.id === id)

        if (!post) {
            setFailMsg('文章获取失败，请稍后重试')
            setTimeout(() => {
                setIsLoading(false)
            }, 250)

            return
        }
        if (post['content:encoded']) {
            post.content = post['content:encoded']
        } else if (post?.description) {
            post.content = post.description
        } else {
            post.content = await fetchData(post.link).content
            if (!res) {
                setFailMsg('文章获取失败，请稍后重试')
            } else {
                post.content = ''
            }
        }
        useStore(state => state.updatePost({ ...post, isRead: true }))
        setArticle(post)
        setIsLoading(false)
        setTimeout(()=>{
            generateToc()
        })
        
    }
    const toggleLaterMark = async (e) => {
        e.preventDefault()

        useStore((state) => state.updatePost({ ...article(), isLater: !article().isLater }))
        setArticle((prev) => {
            return {
                ...prev,
                isLater: !prev.isLater
            }
        })
    }

    const scrollTo=(id)=>{
        const element = document.getElementById(id);
        if (element) {
            console.log('element',element.previousElementSibling)
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        }
    }
    createEffect(on(postId, (id) => {
        getArticle(id)
    }, { defer: false }))
    const loadingContent = () => {
        return (<div class="w-full h-dvh flex justify-center items-center">
            <span class="loading loading-infinity loading-lg"></span>
        </div>)
    }


    const generateToc = () => {
        //  postContent?.querySelectorAll('h1,h2,h3')
        // if (!headings) return
        const postId=article().id
        
        let root=[]
        // for(let i=0;i<headings.length;i++){
        //     headings[i].setAttribute('id', `${postId}-${i}`)
        //     root.push({
        //         href: `#${headings[i].id}`,
        //         text: headings[i].textContent,
        //         level: +headings[i].nodeName[1],
        //     })
        // }
        postContent?.querySelectorAll('h1,h2,h3').forEach((v,i)=>{
            v.id=`${postId}-${i}`
            root.push({
                id: v.id,
                href: `#${v.id}`,
                text: v.textContent,
                level: +v.nodeName[1],
            })
        })
        // console.log('headings',headings)
        setToc(root)
    }

    return (
        <dialog ref={props.ref} class="modal">

            <div class="modal-box max-w-220 max-h-[98vh] rounded p-0  relative overflow-hidden h-full">
                <header class="absolute w-full top-0 left-0 h-12 border-b-1 border-overlay flex items-center px-24 bg-blank justify-between">
                    <h2 class="font-bold text-xl text-primary">{article().title}</h2>
                    <div class={`text-2xl text-secondary ${article().isLater ? 'i-mdi-bookmark' : 'i-mdi-bookmark-outline'}`} onClick={toggleLaterMark} />
                </header>
                <div class="absolute top-16 right-[1rem] w-36  max-h-8xl">
                    <Toc data={toc()} click={scrollTo} />
                </div>
                <div id='post-content' class="post-content overflow-y-auto h-full pt-12  prose prose-primary px-24 max-w-full  pr-40">

                    <Show when={!isLoading()} fallback={loadingContent()}>
                        <div  ref={postContent} class="py-4" innerHTML={article()?.content || '<div />'}></div>
                    </Show>
                    <Show when={failMsg() && !isLoading()}>
                        <div class="w-full h-full flex justify-center items-center">
                            <p>{failMsg()}</p>
                        </div>
                    </Show>
                </div>
                {/* <div class="modal-action"> */}

                {/* </div> */}
            </div>
            <form method="dialog" class="modal-backdrop transition-all bg-overlay opacity-90">
                <button class="btn w-dvw h-dvh opacity-0">Close</button>
            </form>
        </dialog>
    )
}