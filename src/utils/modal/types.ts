export type ModalProps = {
    title: string
    content?: string
    confirm?: () => void
    cancel?: () => void
    confirmText?: string
    cancelText?: string,
    resolve?: () => void
}
