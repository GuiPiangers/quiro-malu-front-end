import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles } from './Styles'

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sub_title]}>{children}</Text>
      <View style={[styles.line, styles.__background_main_color]}></View>
    </View>
  )
}

export default function PatientPdf() {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        <View style={styles.section}>
          <Text style={[styles.title]}>Ficha do paciente</Text>
        </View>
        <SubTitle>Dados Pessoais</SubTitle>

        <View style={[styles.section, styles.__flex]}>
          <Text style={styles.__flex_full}>
            <Text style={[styles.__bold]}>Nome: </Text>
            Guilherme Eduardo Martins Piangers
          </Text>

          <Text style={styles.__flex_full}>
            <Text style={[styles.__bold]}>Profissão: </Text>
            Engenheiro Químico na Brastenk Técnologias
          </Text>

          <Text style={styles.__flex_full}>
            <Text style={[styles.__bold]}>Escolaridade: </Text>
            Ensino superior completo
          </Text>

          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>Telefone: </Text>
            (11) 99999-9999
          </Text>

          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>CPF: </Text>
            123.243.245-35
          </Text>

          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>Data de Nascimento: </Text>
            17/04/1999
          </Text>

          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>Gênero: </Text>
            Masculino
          </Text>

          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>Estado Civil: </Text>
            Solteiro
          </Text>
        </View>

        <SubTitle>Endereço</SubTitle>

        <View style={[styles.section]}>
          <Text>
            <Text style={[styles.__bold]}>CEP: </Text>
            88805-130
          </Text>

          <Text>
            <Text style={[styles.__bold]}>Estado: </Text>
            Rio Grande do Norte
          </Text>

          <Text>
            <Text style={[styles.__bold]}>Cidade: </Text>
            São José do Vale do Rio Preto
          </Text>

          <Text>
            <Text style={[styles.__bold]}>Bairro: </Text>
            Masculino
          </Text>

          <Text>
            <Text style={[styles.__bold]}>Endereço: </Text>
            Rua Imigrante Sônego, 790
          </Text>
        </View>

        <SubTitle>Anamnese</SubTitle>

        <View style={[styles.section]}>
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Queixa Principal:</Text>
            <Text>
              Relata desgaste na coluna. Desgaste nos quadril Relata que teve
              duas distensão no joelho Tem desgaste nos joelhos{' '}
            </Text>
          </View>

          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>História e moléstia atual: </Text>
            <Text>Teve fratura esposto no tornozelo há mais de 20 anos. </Text>
          </View>

          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Histórico e antecedentes:</Text>
            <Text>Teve fratura esposto no tornozelo há mais de 20 anos. </Text>
          </View>

          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Histórico familiar:</Text>
            <Text>
              {`Pai: Hipertensão arterial, diabetes tipo 2, osteoporose
Mãe:problemas cardíacos`}
            </Text>
          </View>

          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Atividades que realiza</Text>
            <Text>
              {`Pai: Hipertensão arterial, diabetes tipo 2, osteoporose
Mãe:problemas cardíacos`}
            </Text>
          </View>

          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Fumante?</Text>
            <Text>Passivo</Text>
          </View>

          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Usa medicamentos?</Text>
            <Text>Sim</Text>
            <Text style={[styles.__bold]}>Medicamentos:</Text>
            <Text>Aspirina, endorfinba</Text>
          </View>

          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Passou por alguma cirurgia?</Text>
            <Text>Sim</Text>
            <Text style={[styles.__bold]}>Cirurgias:</Text>
            <Text>Cirurgia para hérnia de disco</Text>
          </View>
        </View>

        <SubTitle>Diagnóstico</SubTitle>

        <View style={[styles.container, styles.section]} wrap={false}>
          <Text style={styles.__no_content}>
            Descrição do diagnóstico do paciente
          </Text>
        </View>

        <SubTitle>Plano de tratamento</SubTitle>

        <View style={[styles.container, styles.section]} wrap={false}>
          <Text style={styles.__no_content}>
            Nenhum plano de tratamento criado
          </Text>
        </View>
      </Page>
    </Document>
  )
}
