import { createSignal, Switch, Match, Show } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import AppendItem from "../components/Append/Item";

import { extract } from '@extractus/feed-extractor'
export default function AppendPage() {
    const [activeTab, setActiveTab] = createSignal(0);
    const [searchRes, setSearchRes] = createSignal<any[]>([]);
    let searchIuput: HTMLInputElement|undefined

    const getData = async (str: string) => {
        "use server";
        let res
        try {
            res =await extract(str,{descriptionMaxLen:0,normalization:false})
        }catch (e) {
            console.log(e)
        }
        return res
    }

    const search=debounce(async()=>{
        const value=searchIuput?.value
        if(!value) return 
        const res=await getData(value)
        if(res){
            setSearchRes([res])
        }else {
            setSearchRes([])
        }
    },250)
    return (<div class="p-4 bg-blank h-full">
        <div role="tablist" class="tabs tabs-lifted">
            <a role="tab" onClick={()=>setActiveTab(0)}  class="tab">RSS地址</a>
            <a role="tab" onClick={()=>setActiveTab(1)} class="tab tab-active">RSSHub</a>
        </div>
        <div class="">
        <Switch fallback={<div>Not Found</div>}>
            <Match when={activeTab() === 0}>
                <>
                <label class="input input-bordered flex items-center gap-2">
                    <input ref={searchIuput} type="text" class="grow" placeholder="Search" onKeyUp={search} />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
                </label>
                <div class="mt-5">
                    <Show when={searchRes().length} fallback={<div>Not Found</div>}>
                    <AppendItem {...searchRes()[0]} />
                    </Show>
                    
                </div>
                </>
            </Match>
            <Match when={activeTab() === 1}>
                <></>
            </Match>
            </Switch>
        </div>
    </div>)
}