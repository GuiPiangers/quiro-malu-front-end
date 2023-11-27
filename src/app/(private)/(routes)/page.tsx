import { Logo } from '@/components/logo'
import UserProfile from '@/app/(private)/components/UserProfile'
import { userService } from '@/services/user/serverUserService'
import { Table } from '@/components/table'
import { Input } from '@/components/input/index'
import { GenerateWorkHours } from '@/utils/GenerateWorkHours'

export default async function Home() {
  const profile = await userService.get()

  const day1 = new GenerateWorkHours({
    schedulingDuration: 60,
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '10:00', end: '19:00' },
    ],
  })

  return (
    <section className="">
      {/* <Input.Root>
        <Input.Label>Teste de input</Input.Label>
        <Input.Field placeholder="Digite algo..." />
      </Input.Root> */}

      <p>{profile ? profile.name : ''}</p>
      <UserProfile />
      <Logo.Root>
        <Logo.Image className="h-14" />
        <Logo.Text className="h-8" />
      </Logo.Root>
      <Table.Root>
        <Table.Row
          columns={['1fr', '1fr', '1fr']}
          className="grid-cols-3"
          clickable
        >
          <span>Isso aqui</span>
          <span>Aquilo ali</span>
          <span>Aquilo ali</span>
        </Table.Row>
        <Table.Row columns={['1fr', '1fr', '1fr']} className="grid-cols-3">
          <span>Isso aqui</span>
          <span>Aquilo ali</span>
          <span>Aquilo ali</span>
        </Table.Row>
      </Table.Root>
    </section>
  )
}
