import { HTMLAttributes } from 'react'
import { Accordion } from '../accordion'

type ItemProps = HTMLAttributes<HTMLDivElement>

export const AccordionTableItem = function ({ children, ...props }: ItemProps) {
  return <Accordion.Item {...props}>{children}</Accordion.Item>
}
