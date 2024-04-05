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
            const req=window.indexedDB.open('rss',2)
            req.onupgradeneeded=(e)=>{
                this.db = e.target.result
                if(!this.db.objectStoreNames.contains('feeds')){
                    const store=this.db.createObjectStore('feeds',{keyPath:'id'})
                    store.createIndex('title','title',{unique:false})
                    store.createIndex('description','description',{unique:false})
                    store.createIndex('item','item',{unique:false,multiEntry:true})
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
                resolve(req)
            }
        })

    }
    add(storeName="feeds",data:Feed){
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
}
const db=new feedsDB()
export default db