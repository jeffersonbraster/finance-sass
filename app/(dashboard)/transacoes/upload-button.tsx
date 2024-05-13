import React from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

import { useCSVReader } from 'react-papaparse'

type Props = {
  onUpload: (results: any) => void
}

const UploadButton = ({ onUpload }: Props) => {
  const {CSVReader} = useCSVReader()

  return (
    <CSVReader onUploadAccepted={onUpload} delimiter="," >
      {({getRootProps}: any) => (
        <Button size="sm" className='w-full lg:w-auto' {...getRootProps()}>
          <Upload className='size-4 mr-2' />
          Importar
        </Button>
      )}
    </CSVReader>
  )
}

export default UploadButton