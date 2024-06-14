import ModeSelect from '../ModeSelect/ModeSelect'
import { Box, Button, SvgIcon, Typography } from '@mui/material'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '../../assets/trello.svg'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'


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
          {/* Tìm kiếm nhanh một hoặc nhiều cái board */}
          <AutoCompleteSearchBoard />

          {/* Dark - Light - System modes */}
          <ModeSelect/>

          {/* Xử lý hiển thị các thông báo - notifications ở đây */}
          <Notifications />

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
          </Tooltip>

          <Profiles />


        </Box>
      </Box>
    </>
  )
}
export default AppBar