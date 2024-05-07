import {useState} from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'


const UseConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{resolve: (value: boolean) => void} | null>(null)

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({resolve})
  })

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className='pt-2'>
          <Button variant={"outline"} onClick={handleCancel}>Cancelar</Button>

          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmationDialog, confirm]
}

export default UseConfirm