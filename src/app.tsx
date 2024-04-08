import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import "~/assets/styles/vars.scss"
import { onMount,createSignal, Show } from "solid-js"

import { Router, Route } from "@solidjs/router"
import Home from "./routes/index"
import Subscribe from "./routes/subscribe/index"
import Post from "./routes/post"
import Append from "./routes/append"
import db from "~/utils/db"
import uuid from '~/utils/uuid'
import { useStore } from "./store"
import bus from "~/utils/bus"


export default function App() {
  const [isInit,setIsInit]=createSignal(false)
  onMount(async()=>{
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
  }
    window.$db=db
    await window.$db.init()
    // console.log('init')
    const feedsRes=await window.$db.read('feeds')
    console.log('read feeds')
    const postRes=await window.$db.read('posts')
    console.log('read posts')
    useStore(state=>state.init({
        feeds:feedsRes,
        posts:postRes
    }))
    
    
    window.$uuid=uuid
    setIsInit(true)
    bus.emit('updatePost')
  })
  return (
    <Show when={isInit()} fallback={<span>Loading</span>}>

 
    <Router base="/">
      <Route path="/" component={Home} >
        <Route path="/" component={Subscribe} />
        <Route path="subscribe">
          <Route path="/:subId?">
            <Route path="/"  component={Subscribe} />
            <Route path="/post" component={Subscribe} >

              <Route path="/:postId" component={Post} />
            </Route>
          </Route>
        </Route>
        <Route path="/append" component={Append} />
      </Route>


    </Router>
    </Show>
  )
}
