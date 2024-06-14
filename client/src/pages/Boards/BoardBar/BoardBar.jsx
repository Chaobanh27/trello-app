import { Box } from '@mui/material'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'

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
          {/* Xử lý mời user vào làm thành viên của board */}
          <InviteBoardUser boardId={board._id} />
          <BoardUserGroup boardUsers={board?.FE_allUsers} />
        </Box>
      </Box>
    </>
  )
}

export default BoardBar