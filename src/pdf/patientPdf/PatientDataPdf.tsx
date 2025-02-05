import { PatientResponse } from '@/services/patient/patient'
import { SubTitle } from './PatientPdf'
import { Text, View } from '@react-pdf/renderer'
import { styles } from './Styles'
import { patientPDFData } from '@/services/patientPDF/patientPdfTypes'

export default function PatientDataPdf({
  patientData: {
    name,
    phone,
    cpf,
    dateOfBirth,
    education,
    gender,
    maritalStatus,
    profession,
  },
}: {
  patientData: patientPDFData
}) {
  return (
    <>
      <SubTitle>Dados Pessoais</SubTitle>

      <View style={[styles.section, styles.__flex]}>
        <Text style={styles.__flex_full}>
          <Text style={[styles.__bold]}>Nome: </Text>
          {name}
        </Text>

        {profession && (
          <Text style={styles.__flex_full}>
            <Text style={[styles.__bold]}>Profissão: </Text>
            {profession}
          </Text>
        )}

        {education && (
          <Text style={styles.__flex_full}>
            <Text style={[styles.__bold]}>Escolaridade: </Text>
            {education}
          </Text>
        )}

        {phone && (
          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>Telefone: </Text>
            {phone}
          </Text>
        )}

        {cpf && (
          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>CPF: </Text>
            {cpf}
          </Text>
        )}

        {dateOfBirth && (
          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>Data de Nascimento: </Text>
            {dateOfBirth}
          </Text>
        )}

        {gender && (
          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>Gênero: </Text>
            {gender}
          </Text>
        )}

        {maritalStatus && (
          <Text style={styles.__flex_half}>
            <Text style={[styles.__bold]}>Estado Civil: </Text>
            {maritalStatus}
          </Text>
        )}
      </View>
    </>
  )
}
