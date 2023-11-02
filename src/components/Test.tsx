'use client'

import * as Accordion from '@radix-ui/react-accordion'

export default function Acordion() {
  return (
    <Accordion.Root type="multiple">
      <Accordion.Item value="valor">
        <Accordion.Header>
          <Accordion.Trigger>Isso aqui</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Aquilo ali</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
