import Input from '@/components/Input'
import { Logo } from '@/components/logo'
import UserProfile from '@/app/(private)/components/UserProfile'
import { userService } from '@/services/user/serverUserService'
import { Table } from '@/components/table'
import AccordionDemo from '@/components/Test'

export default async function Home() {
  const profile = await userService.get()

  return (
    <section className="">
      <Input label="Nome"></Input>
      <p>{profile ? profile.name : ''}</p>
      <UserProfile />
      <Logo.Root>
        <Logo.Image className="h-14" />
        <Logo.Text className="h-8" />
      </Logo.Root>
      <Table.Root columns={['1fr', '1fr', '1fr']}>
        <Table.Row>
          <span>Isso aqui</span>
          <span>Aquilo ali</span>
          <span>Aquilo ali</span>
        </Table.Row>
        <Table.Row>
          <span>Isso aqui</span>
          <span>Aquilo ali</span>
          <span>Aquilo ali</span>
        </Table.Row>
      </Table.Root>
    </section>
  )
}
