
import Menu from "~/components/Menu/Menu";
import './index.scss'
import type { RouteSectionProps } from "@solidjs/router";


export default function Home(props:RouteSectionProps) {
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
            "--offset-left",
            val-container.offsetLeft + "px",
        )
    }
    const dragOut = () => {
        document.removeEventListener("mousemove", dragMove)
        document.removeEventListener("mouseup", dragOut)
    }

  return (
	
	<main ref={container} id="container">
	<section class="bg-mantle p-2 border-r border-overlay">
		<Menu />
	</section>
	<div  ref={resizer} onMouseDown={dragOn} class="resizer resizer-left"></div>
	<section class="bg-blueGray h-full">
		{props.children}
	</section>
</main>
  );
}
