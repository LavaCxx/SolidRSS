import type { ModalProps } from "./types"
import {render} from "solid-js/web"
export const useModal = (props:ModalProps) => {
    const Modal = (props: ModalProps) => {
        return (
            <dialog id="my_modal_2" class="modal">
            <div class="modal-box">
              <h3 class="font-bold text-lg">{props.title}</h3>
              {props.content}
            </div>
            <form method="dialog" class="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        )
    }
    return new Promise((resolve,reject)=>{
      render(()=><Modal {...props} />,document.body)
    })
} 