import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles } from './Styles'
import PatientDataPdf from './PatientDataPdf'
import AnamnesisDataPdf from './AnamnesisDataPdf'
import LocationDataPdf from './LocationDataPdf'
import { PatientPdfProps } from '@/services/patientPDF/patientPdfTypes'

export function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sub_title]}>{children}</Text>
      <View style={[styles.line, styles.__background_main_color]}></View>
    </View>
  )
}

export default function PatientPdf({
  patientData,
  anamnesisData = {},
  diagnosticData: { diagnostic, treatmentPlan } = {},
  locationData = {},
}: PatientPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        <View style={styles.section}>
          <Text style={[styles.title]}>Ficha do paciente</Text>
        </View>

        <PatientDataPdf patientData={patientData}></PatientDataPdf>

        {Object.keys(locationData).length > 0 && (
          <LocationDataPdf locationData={locationData} />
        )}

        {Object.keys(anamnesisData).length > 0 && (
          <AnamnesisDataPdf anamnesisData={anamnesisData} />
        )}

        {diagnostic && (
          <>
            <SubTitle>Diagnóstico</SubTitle>
            <View style={[styles.container, styles.section]} wrap={false}>
              <Text style={styles.__no_content}>{diagnostic}</Text>
            </View>
          </>
        )}

        {treatmentPlan && (
          <>
            <SubTitle>Plano de tratamento</SubTitle>

            <View style={[styles.container, styles.section]} wrap={false}>
              <Text style={styles.__no_content}>{treatmentPlan}</Text>
            </View>
          </>
        )}
      </Page>
    </Document>
  )
}
