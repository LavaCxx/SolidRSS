import {For,createMemo } from "solid-js"
type TocProps = {
    data:any,
    click:(item:any)=>void
}


export default(props:TocProps)=>{
    const TocItem=(item)=>(
        <div  class="text-xs cursor-pointer" style={{'padding-left':`${(item.level-item.top)*20}px`}} onClick={()=>props.click(item.id)}>{item.text}</div>
    )
    const topHeader=createMemo(()=>Math.min(...props.data.map(v=>v.level)))
    return (
        <div class="toc flex flex-col gap-y-1">
            <For each={props.data}>
                {(item) => <TocItem {...item} top={topHeader()}  />}
            </For>
        </div>
    )
}