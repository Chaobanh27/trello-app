/* eslint-disable no-console */
import { useState } from 'react'
import { Box, Tooltip, Typography, TextField } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteIcon from '@mui/icons-material/Delete'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCard from './ListCards/ListCard'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { mapOrder } from '../../../../../utils/sort'
import { useConfirm } from 'material-ui-confirm'
import { cloneDeep } from 'lodash'
import { createNewCardAPI, deleteColumnDetailsAPI } from '../../../../../apis'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '../../../../../redux/activeBoard/activeBoardSlice'

const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

function Column({ column, deleteCard }) {
  //console.log(column)
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Title is requied', { position: 'bottom-right' })
      return
    }

    //tạo dữ liệu Column để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    //Gọi API tạo mới card và làm lại dữ liệu state board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: '655661e4a79869e31e9cb1bc'
    })
    //console.log(createdCard)

    //update state board
    // Tương tự hàm createNewColumn nên chỗ này dùng cloneDeep
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      }
      else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }

    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    //đóng trạng thái thêm column mới và clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title:'Delete Column ?',
      description: 'This action will delete your column and its cards ! are you sure ?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'

      // description: 'please write down Column to confirm ',
      // confirmationKeyword: 'Column'
    })
      .then(() => {
        //console.log(columnId)
        //update cho đúng dữ liệu state board
        // Tương tự đoạn xử lý chỗ hàm moveColumns nên không ảnh hưởng Redux Toolkit Immutability gì ở đây cả.
        const newBoard = { ...board }
        newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(c => c !== column._id)
        // setBoard(newBoard)
        dispatch(updateCurrentActiveBoard(newBoard))
        //gọi API xử lý
        deleteColumnDetailsAPI(column._id).then(res => {
          //console.log(res)
          toast.success(res?.deleteResult)
        })
      })
      .catch(() => {})
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: column._id, data: { ...column } })


  const dndKitColumnStyles = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  return (
    //phai boc div o day vi van de chieu cao cua column khi keo tha se co bug kieu flickering
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
      <Box
        {...listeners}
        sx={{
          minWidth:'300px',
          maxWidth:'300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#708090' : '#ffffff'),
          ml:2,
          borderRadius:'6px',
          height: 'fit-content',
          cursor:'pointer',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>

        <Box sx={{
          height: COLUMN_HEADER_HEIGHT,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography>{column?.title}</Typography>
          <Box>
            <ExpandMoreIcon
              sx={{ color: 'text.primary', cursor: 'pointer' }}
              id='basic-column-dropdown'
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            />
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <Paper sx={{ maxWidth: '100%' }}>
                <MenuList>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                    <Typography variant="body2" color="text.secondary">
        ⌘X
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                    <Typography variant="body2" color="text.secondary">
        ⌘C
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                    <Typography variant="body2" color="text.secondary">
        ⌘V
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={handleDeleteColumn}
                    sx={{
                      '&:hover': {
                        color: 'warning.dark',
                        '& .delete-forever-icon': { color: 'warning.dark' }
                      }
                    }}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete this column</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <Cloud fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive this column</ListItemText>
                  </MenuItem>
                </MenuList>
              </Paper>
            </Menu>
          </Box>
        </Box>
        <ListCard cards={orderedCards } deleteCard = { deleteCard } />
        <Box sx={{
          height: COLUMN_FOOTER_HEIGHT,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          { !openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddIcon/>} onClick={toggleOpenNewCardForm} >Add New Card</Button>
              <Tooltip title='Drag to move' sx={{ cursor: 'pointer' }} >
                <DragHandleIcon/>
              </Tooltip>
            </Box>
            :<Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }} >
              <TextField
                label = 'Enter card title...'
                type='text'
                size='small'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                variant='outlined'
                autoFocus
                data-no-dnd = 'true'
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Muifocused': { color: (theme) => (theme.palette.primary.main) },
                  '& .MuiOutlinedInput-root' : {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap:'8px' }} >
                <Button
                  className='interceptor-loading'
                  onClick={addNewCard}
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow:'none',
                    border:'0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor:(theme) => theme.palette.success.main }
                  }}>
                Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color:'white',
                    cursor:'pointer',
                    '&:hover': { color:(theme) => theme.palette.warning.light }
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }


        </Box>
      </Box>
    </div>

  )
}

export default Column