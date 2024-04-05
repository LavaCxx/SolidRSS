
import Menu from "~/components/Menu/Menu";
import './index.scss'
import type { RouteSectionProps } from "@solidjs/router";


export default function Home(props:RouteSectionProps) {
  return (
	
	<main id="container">
	<section class="bg-mantle p-2 border-r border-overlay">
		<Menu />
	</section>
	<div class="resizer resizer-left"></div>
	<section class="bg-blueGray h-full">
		{props.children}
	</section>
</main>
  );
}
