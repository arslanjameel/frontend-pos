// ** MUI Imports
import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
// import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import ChooseStoreModal from 'src/components/stores/ChooseStoreModal'
import SwitchUserModal from 'src/components/userAccounts/SwitchUserModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { openStoreModal } from 'src/store/reducers/appSlice'
import { isStoreSelected } from 'src/utils/storeUtils'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, toggleNavVisibility } = props

  const { isMobileSize } = useWindowSize()
  const dispatch = useAppDispatch()
  const { store } = useAppSelector(state => state.app)

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          className='actions-left'
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {hidden ? (
            <IconButton
              color='inherit'
              sx={{ ml: -2.75 }}
              onClick={toggleNavVisibility}
            >
              <Icon
                fontSize='1.5rem'
                icon='tabler:menu-2'
              />
            </IconButton>
          ) : null}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Icon icon='tabler:search' color='#4d4d4d' />
            <TextField
              variant='standard'
              placeholder='Search (Ctrl+/)'
              InputProps={{ disableUnderline: true }}
            />
          </Box>
        </Box>

        <Box
          className='actions-right'
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <ResponsiveButton
            showStartIcon
            icon='tabler:building-store'
            onClick={() => dispatch(openStoreModal())}
            label={
              isStoreSelected(store) ? store.name : 'Store'
            }
            mini={isMobileSize}
            size='large'
            variant='tonal'
          />
          <IconButton color='primary' size='large'>
            <Icon
              icon='tabler:layout-grid-add'
              fontSize={25}
            />
          </IconButton>
          <UserDropdown settings={settings} />
        </Box>
      </Box>

      <ChooseStoreModal />
      <SwitchUserModal />
    </>
  )
}

export default AppBarContent
