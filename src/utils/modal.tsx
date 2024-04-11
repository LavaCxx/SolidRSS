import { onCleanup } from "solid-js"
import type { ModalProps } from "./modal/types"
import {render} from "solid-js/web"
export const useModal = (props:ModalProps) => {
    let modalRef:HTMLDialogElement|undefined
    // const [modalResolve,setModalResolve]=createSignal()
    let modalResolve:any
    let modalReject:any

    const Modal = () => {
        return (
            <dialog ref={modalRef} class="modal">
            <div class="modal-box">
              <h3 class="font-bold text-lg">{props.title}</h3>
              {props.content}
              <form method="dialog">
              <button onClick={()=>{
                modalResolve()
                modalRef?.close()
                // dispose()
              }}>{props.cancelText||'取消'}</button>
              <button onClick={()=>{
                modalReject()
                modalRef?.close()
                // dispose()
              }}>{props.confirmText||'确认'}</button>
            </form>

            </div>
            <form method="dialog" class="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        )
    }
    const dispose=render(()=><Modal />,document.body)
    onCleanup(()=>{
      // dispose()
    })
    return new Promise((resolve,reject)=>{
      modalResolve=resolve
      modalReject=reject
      modalRef?.showModal()
    })
} 