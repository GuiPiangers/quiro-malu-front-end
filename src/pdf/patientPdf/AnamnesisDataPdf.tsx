import { AnamnesisResponse } from '@/services/patient/patient'
import { SubTitle } from './PatientPdf'
import { Text, View } from '@react-pdf/renderer'
import { styles } from './Styles'
import { anamnesisPDFData } from '@/services/patientPDF/patientPdfTypes'

export default function AnamnesisDataPdf({
  anamnesisData: {
    activities,
    currentIllness,
    familiarHistory,
    history,
    mainProblem,
    medicines,
    smoke,
    surgeries,
    underwentSurgery,
    useMedicine,
  },
}: {
  anamnesisData: anamnesisPDFData
}) {
  const smokeTranslate = {
    passive: 'Passivo',
    yes: 'Sim',
    no: 'Não',
  }
  return (
    <>
      <SubTitle>Anamnese</SubTitle>

      <View style={[styles.section]}>
        {mainProblem && (
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Queixa Principal:</Text>
            <Text>{mainProblem}</Text>
          </View>
        )}

        {currentIllness && (
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>História e moléstia atual: </Text>
            <Text>{currentIllness}</Text>
          </View>
        )}

        {history && (
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Histórico e antecedentes:</Text>
            <Text>{history}</Text>
          </View>
        )}

        {familiarHistory && (
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Histórico familiar:</Text>
            <Text>{familiarHistory}</Text>
          </View>
        )}

        {activities && (
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Atividades que realiza</Text>
            <Text>{activities}</Text>
          </View>
        )}

        {smoke && (
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Fumante?</Text>
            <Text>{smokeTranslate[smoke as keyof typeof smokeTranslate]}</Text>
          </View>
        )}

        {useMedicine !== undefined && (
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Usa medicamentos?</Text>
            <Text>{useMedicine ? 'Sim' : 'Não'}</Text>
            {useMedicine && (
              <>
                <Text style={[styles.__bold]}>Medicamentos:</Text>
                <Text>{medicines}</Text>
              </>
            )}
          </View>
        )}

        {underwentSurgery !== undefined && (
          <View style={[styles.container]} wrap={false}>
            <Text style={[styles.__bold]}>Passou por alguma cirurgia?</Text>
            <Text>{underwentSurgery ? 'Sim' : 'Não'}</Text>
            {underwentSurgery && (
              <>
                <Text style={[styles.__bold]}>Cirurgias:</Text>
                <Text>{surgeries}</Text>
              </>
            )}
          </View>
        )}
      </View>
    </>
  )
}
