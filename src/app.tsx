import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import "~/assets/styles/vars.scss"
import { onMount } from "solid-js"

import { Router, Route } from "@solidjs/router"
import Home from "./routes/index"
import Subscribe from "./routes/subscribe/index"
import Post from "./routes/post"
import Append from "./routes/append"
import db from "~/utils/db"
import uuid from '~/utils/uuid'
import { useStore } from "./store"


export default function App() {
  onMount(async()=>{
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
  }
    window.$db=db
    await window.$db.init()
    const feedsRes=await window.$db.read('feeds')
    const postRes=await window.$db.read('posts')
    useStore(state=>state.init({
        feeds:feedsRes.result,
        posts:postRes.result
    }))
    console.log('uuid',uuid)
    
    window.$uuid=uuid
  })
  console.log('uuid',uuid)
  return (
    <Router>
      <Route path="/" component={Home}>
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
  )
}
