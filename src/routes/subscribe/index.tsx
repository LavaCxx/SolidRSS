
import './subscribe.scss'
import Subs from "~/components/Subs/Subs";
import { useParams } from "@solidjs/router";
import { onMount } from 'solid-js'
export default function SubscribePage(props){
    let container: HTMLElement | undefined
    let resizer: HTMLDivElement | undefined
    let resizeVal = 160
    const dragOn = (e: MouseEvent) => {
        e.preventDefault()
        document.addEventListener("mousemove", dragMove)
        document.addEventListener("mouseup", dragOut)
    }
    const dragMove = (e: MouseEvent) => {
        if (!container) return
        let val = e.clientX
        resizeVal = val
        container.style.setProperty(
            "--offset-mid",
            val-container.offsetLeft + "px",
        )
    }
    const dragOut = () => {
        document.removeEventListener("mousemove", dragMove)
        document.removeEventListener("mouseup", dragOut)
    }

    const params = useParams();
    return (
        <main ref={container} id="reader">
        <section class="bg-blank h-full  border-r border-overlay">
            <Subs subId={params.subId||'all'} />
        </section>
        <div ref={resizer} onMouseDown={dragOn} class="resizer resizer-mid"></div>
        <section class="bg-blank  overflow-y-auto">
            {props.children}
        </section>
        </main>
    )
}