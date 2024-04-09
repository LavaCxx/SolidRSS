import { resolve } from 'vinxi/.'
import bus from './bus'
interface Feed {
    title:string
    description:string
    item:any[]
    link:string
    image:{
        url:string
    }
}

class feedsDB {
    req:any
    db:any
    constructor() {
        
    }
    init(){
        return new Promise((resolve,reject)=>{
            const req=window.indexedDB.open('rss')
            req.onupgradeneeded=(e)=>{
                this.db = e.target.result
                if(!this.db.objectStoreNames.contains('feeds')){
                    const store=this.db.createObjectStore('feeds',{keyPath:'id'})
                    store.createIndex('title','title',{unique:false})
                    store.createIndex('icon','icon',{unique:false})
                    store.createIndex('description','description',{unique:false})
                    store.createIndex('unread','unread',{unique:false})
                    store.createIndex('link','link',{unique:false,multiEntry:true})
                    store.createIndex('image.url','image.url',{unique:true})
                }   
                if(!this.db.objectStoreNames.contains('posts')){
                    const store=this.db.createObjectStore('posts',{keyPath:'id'})
                    store.createIndex('feedId','feedId',{unique:false})
                    store.createIndex('title','title',{unique:false})
                    store.createIndex('description','description',{unique:false})
                    
                    store.createIndex('content','content',{unique:false})
                    store.createIndex('favicon','favicon',{unique:false})
                    store.createIndex('links','links',{unique:false,multiEntry:true})
                    store.createIndex('published','published',{unique:false})
                    store.createIndex('source','source',{unique:false})
                    store.createIndex('ttr','ttr',{unique:false})
                    store.createIndex('type','type',{unique:false})
                    store.createIndex('url','url',{unique:false})
                    store.createIndex('isRead','isRead',{unique:false})
                    store.createIndex('isLater','isLater',{unique:false})
                    store.createIndex('feedSource.name','feedSource.name',{unique:false})
                    store.createIndex('feedSource.link','feedSource.link',{unique:false})
                }   
                
            }
            req.onsuccess=()=>{
                this.db = req.result
                resolve(true)
            }
        })
    }
    read(storeName='feeds',key:string|undefined){
        return new Promise((resolve,reject)=>{
            const transaction=this.db.transaction([storeName])
            const store=transaction.objectStore(storeName)
            let req
            if(key){
                 req=store.get(key)
            }else{
                req=store.getAll()
            }
            req.onerror = function(event) {
               reject(event)
              };
            req.onsuccess=()=>{
                resolve(req.result)
            }
        })
    }
    count(storeName='feeds',filter:(obj:any)=>boolean){
        return new Promise((resolve,reject)=>{
            let count = 0;
            const store=this.db.transaction([storeName],'readonly').objectStore(storeName)
            const req =store.openCursor();
            req.onsuccess = () => {
                const cursor=req.result
                if(cursor){
                    if(filter(cursor.value)) count++
                    cursor.continue();
                }else{
                    resolve(count)
                }
              };
        })
    }
    add(storeName="feeds",data:any){
        return new Promise((resolve,reject)=>{
            const req=this.db.transaction([storeName],'readwrite').objectStore(storeName).add(data)
            req.onsuccess = function (event) {
                resolve(event)
              };
            
              req.onerror = function (event) {
                reject(event)
              }
        })
    }
    batchAdd(storeName="feeds",data:any[]){
        const objectStore=this.db.transaction([storeName],'readwrite').objectStore(storeName)
        return new Promise((resolve,reject)=>{
            for(let i=0;i<data.length;i++){
                const req=objectStore.add(data[i])
                req.onsuccess = function (event) {
                    resolve(event)
                }
                req.onerror = function (event) {
                    reject(event)
                  }
            }
        })
    }
    update(storeName='feeds',data:any){
        return new Promise((resolve,reject)=>{
            const req=this.db.transaction([storeName],'readwrite').objectStore(storeName).put(data)
            req.onsuccess = function (event) {
                resolve(event)
              };
            
              req.onerror = function (event) {
                reject(event)
              }
        })
    }
    deleteFeed(id:string){
        return new Promise((resolve,reject)=>{
            const req=this.db.transaction(['feeds'],'readwrite').objectStore('feeds').delete(IDBKeyRange.only(id))
            req.onsuccess = (event)=> {
                console.log('req',req,id)
                const postReq=this.db.transaction(['posts'],'readwrite').objectStore('posts').index('feedId').openCursor()
                postReq.onsuccess = () => {
                    const cursor=postReq.result
                    console.log('cursor',cursor)
                    if(cursor){
                        if(cursor.key===id) cursor.delete(cursor.primaryKey)
                        cursor.continue()
                    }else{
                        resolve(true)
                    }
                }
            }

            
            req.onerror = function (event) {
            reject(event)
            }
        })   
    }
    batchUpdate(storeName='feeds',data:any[]){
        const objectStore=this.db.transaction([storeName],'readwrite').objectStore(storeName)
        return new Promise((resolve,reject)=>{
            for(let i=0;i<data.length;i++){
                const req=objectStore.put(data[i])
                req.onsuccess = function (event) {
                    resolve(event)
                }
                req.onerror = function (event) {
                    reject(event)
                  }
            }
        })
    }
}
const db=new feedsDB()
export default db