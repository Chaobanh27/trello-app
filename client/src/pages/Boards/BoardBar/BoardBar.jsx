import { Box, Button, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'

function BoardBar(props) {

  const board = props.board

  const MENU_STYLES = {
    color:'primary.main',
    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#ffffff'),
    border: 'none',
    paddingX: '5px',
    borderRadius: '4px',
    '& .MuiSvgIcon-root': {
      color: 'primary.main'
    },
    '&:hover': {
      bgcolor: 'primary.50'
    }
  }
  return (
    <>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0096FF'),
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display:'flex',
        alignItems:'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        borderTop: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#ffffff'),
        paddingX: 2
      }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable />
          <Chip
            sx={MENU_STYLES}
            icon={<VpnLockIcon />}
            label="Dashboard"
            clickable />
          <Chip
            sx={MENU_STYLES}
            icon={<AddToDriveIcon />}
            label="Dashboard"
            clickable />
        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <Button variant='outlined' startIcon={<PersonAddAltIcon/>} >Invite</Button>
          <AvatarGroup max={7} sx={{
            '& .MuiSvgIcon-root': {
              width: 34,
              height: 34,
              fontSize: 16
            }
          }}>
            <Tooltip title='user1'>
              <Avatar alt="Remy Sharp" src="https://picsum.photos/id/400/300/300" />
            </Tooltip>
            <Tooltip title='user2'>
              <Avatar alt="Remy Sharp" src="https://picsum.photos/id/500/300/300" />
            </Tooltip>
            <Tooltip title='user3'>
              <Avatar alt="Remy Sharp" src="https://picsum.photos/id/234/300/300" />
            </Tooltip>
            <Tooltip title='user4'>
              <Avatar alt="Remy Sharp" src="https://picsum.photos/id/337/300/300" />
            </Tooltip>
            <Tooltip title='user5'>
              <Avatar alt="Remy Sharp" src="https://picsum.photos/id/135/300/300" />
            </Tooltip>
            <Tooltip title='user6'>
              <Avatar alt="Remy Sharp" src="https://picsum.photos/id/200/300/300" />
            </Tooltip>
            <Tooltip title='user7'>
              <Avatar alt="Remy Sharp" src="https://picsum.photos/id/100/300/300" />
            </Tooltip>
            <Tooltip title='user8'>
              <Avatar alt="Remy Sharp" src="https://picsum.photos/id/276/300/300" />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </>
  )
}

export default BoardBar