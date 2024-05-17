import ModeSelect from '../ModeSelect/ModeSelect'
import { Box, Button, SvgIcon, TextField, Typography } from '@mui/material'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '../../assets/trello.svg'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import AccountCircle from '@mui/icons-material/AccountCircle'
import InputAdornment from '@mui/material/InputAdornment'
// import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Profiles from './Menus/Profiles'
import { Link } from 'react-router-dom'

function AppBar() {
  return (
    <>
      <Box sx={{
        width:'100%',
        height: (theme) => theme.trello.appBarHeight,
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        gap: 2,
        overflowX:'auto',
        paddingX: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#0096FF')
      }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          {/* <AppsIcon sx={{ color: 'white' }}/> */}
          <Link to="/boards">
            <Tooltip title="Board List">
              <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
            </Tooltip>
          </Link>
          <Link to="/">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SvgIcon component={TrelloIcon} fontSize="small" inheritViewBox sx={{ color: 'white' }} />
              <Typography variant="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
            </Box>
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }} >
            <Workspaces/>
            <Recent/>
            <Starred/>
            <Templates/>
            <Button sx={{ color: 'white', border:'none', '&:hover':{ border:'none' } }} variant='outlined'>Create</Button>
          </Box>


        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <TextField
            id='outline-search'
            label='Search...'
            type='search'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: 'white' }} />
                </InputAdornment>
              )
            }}
            sx={{
              minWidth: '120px',
              maxWidth: '170px',
              '&label': { color: 'white' },
              '&input' : { color: 'white' },
              '& label.Mui-focused': { color : 'white' },
              '& .MuiOutlinedInput-root' : {
                '& fieldset' : {
                  borderColor: 'white'
                },
                '&:hover fieldset' : {
                  borderColor: 'white'
                }
              }
            }}
          />
          <ModeSelect/>

          <Tooltip title="notification">
            <NotificationsIcon color="action" />
          </Tooltip>

          <Profiles />


        </Box>
      </Box>
    </>
  )
}
export default AppBar