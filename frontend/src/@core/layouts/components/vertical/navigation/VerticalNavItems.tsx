// @ts-nocheck
// ** Types Import
import { Settings } from 'src/@core/context/settingsContext'
import { NavLink, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'

// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'

interface Props {
  settings: Settings
  navVisible?: boolean
  groupActive: string[]
  currentActiveGroup: string[]
  verticalNavItems?: VerticalNavItemsType
  saveSettings: (values: Settings) => void
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
}

const resolveNavItemComponent = (item: NavLink | NavSectionTitle) => {
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle

  return VerticalNavLink
}

const VerticalNavItems = (props: Props) => {
  // ** Props
  const { verticalNavItems } = props

  // Recursively render menu items
  const RenderMenuItems = (items: VerticalNavItemsType) => {
    return items?.map((item: NavLink | NavSectionTitle, index: number) => {
      const TagName: any = resolveNavItemComponent(item)

      let children = null;
      if (item?.children) {
        children = RenderMenuItems(item?.children);
      }

      return (
        <TagName {...props} key={index} item={item}>
          {children}
        </TagName>
      );
    })
  }

  return <>{RenderMenuItems(verticalNavItems)}</>
}

export default VerticalNavItems
