export default (props) =>{
    let folderInput: HTMLInputElement | undefined

    const cancel=()=>{
        props?.onCancel()
    }
    const confirm=()=>{
        const name=folderInput?.value
        props?.onConfirm(name)
    }

    return (
        <dialog ref={props.ref} class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">新建文件夹</h3>
            <div>
            <input ref={folderInput} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
            <button class="btn" onClick={cancel}>取消</button>
            <button class="btn btn-primary" onClick={confirm}>创建</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>
    )
}