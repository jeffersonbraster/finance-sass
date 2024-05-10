import React from 'react'
import {format} from 'date-fns'
import {Calendar as CalendarIcon} from 'lucide-react'
import { SelectSingleEventHandler } from 'react-day-picker'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Calendar } from './ui/calendar'
import {ptBR} from 'date-fns/locale'

type Props = {
  value?: Date
  onChange?: SelectSingleEventHandler
  disabled?: boolean
}

const DatePicker = ({value, onChange, disabled}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={disabled} variant={"outline"} className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}>
          <CalendarIcon className="size-4 mr-2" />
          {value ? format(value, 'PPP', {locale: ptBR}) : (<span>Escolha uma data</span>)}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode='single' selected={value} onSelect={onChange} disabled={disabled} initialFocus locale={ptBR} />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker