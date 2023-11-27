import { InputField } from './InputField'
import InputLabel from './Label'
import InputRoot from './Root'
import InputMessage from './Message'
import Autocomplete from './Autocomplete'
import { SelectField } from './select/SelectField'
import { Option } from './select/Option'

export const Input = {
  Root: InputRoot,
  Label: InputLabel,
  Field: InputField,
  Message: InputMessage,
  Select: SelectField,
  Autocomplete,
  Option,
}
