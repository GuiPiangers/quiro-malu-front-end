import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  page: {
    padding: '30px 50px',
    fontSize: 13,
    fontFamily: 'Helvetica',
  },
  section: {
    marginTop: 16,
    gap: 6,
  },

  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },

  sub_title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },

  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#000',
  },

  container: {
    gap: 6,
    padding: 8,
    border: '1px solid #CBD5E1',
    borderRadius: 8,
  },

  __main_color: {
    color: '#8A48C7',
  },
  __background_main_color: {
    backgroundColor: '#8A48C7',
  },

  __bold: {
    fontWeight: 'black',
    fontFamily: 'Helvetica-Bold',
  },
  __flex: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  __flex_half: {
    flexBasis: '49%',
  },
  __flex_full: {
    flexBasis: '100%',
  },
  __no_content: {
    fontStyle: 'italic',
    color: '#475569',
  },
})
