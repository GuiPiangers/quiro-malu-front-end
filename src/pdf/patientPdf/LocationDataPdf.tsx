import { LocationDTO } from '@/services/patient/patient'
import { SubTitle } from './PatientPdf'
import { Text, View } from '@react-pdf/renderer'
import { styles } from './Styles'
import { locationPDFData } from '@/services/patientPDF/patientPdfTypes'

export default function LocationDataPdf({
  locationData: { address, cep, city, neighborhood, state },
}: {
  locationData: locationPDFData
}) {
  return (
    <>
      <SubTitle>Endereço</SubTitle>

      <View style={[styles.section]}>
        {cep && (
          <Text>
            <Text style={[styles.__bold]}>CEP: </Text>
            {cep}
          </Text>
        )}

        {state && (
          <Text>
            <Text style={[styles.__bold]}>Estado: </Text>
            {state}
          </Text>
        )}

        {city && (
          <Text>
            <Text style={[styles.__bold]}>Cidade: </Text>
            {city}
          </Text>
        )}

        {neighborhood && (
          <Text>
            <Text style={[styles.__bold]}>Bairro: </Text>
            {neighborhood}
          </Text>
        )}

        {address && (
          <Text>
            <Text style={[styles.__bold]}>Endereço: </Text>
            {address}
          </Text>
        )}
      </View>
    </>
  )
}
