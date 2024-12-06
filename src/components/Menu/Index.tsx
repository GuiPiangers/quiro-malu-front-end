import { Menu as _Menu, MenuButton, MenuItem } from './Menu'
import { Dropdown } from '@mui/base/Dropdown'

const Menu = {
  Root: Dropdown,
  Content: _Menu,
  Trigger: MenuButton,
  Item: MenuItem,
}
export default Menu
