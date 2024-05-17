/* eslint-disable no-console */
import { Box, Button, TextField } from '@mui/material'
import Column from './Column/Column'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'
import { createNewColumnAPI } from '../../../../apis'
import { generatePlaceHolderCard } from '../../../../utils/formatter'
import { cloneDeep } from 'lodash'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '../../../../redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'

function ListColumns({ columns, deleteCard }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Title is requied', { position: 'bottom-left' })
      return
    }

    //tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }
    //gọi API tạo mới Column và làm lại dữ liệu state board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    //console.log(createdColumn)
    createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]

    //update state board

    /**
    * Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spread operator là Shallow Copy/Clone,
    * nên dính phải rules Immutability trong Redux Toolkit không dùng được hàm PUSH (sửa giá trị mảng trực tiếp),
    * cách đơn giản nhanh gọn nhất ở trường hợp này của chúng ta là dùng tới Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn.
    * https://redux-toolkit.js.org/usage/immer-reducers
    * Tài liệu thêm về Shallow và Deep Copy Object trong JS:
    * https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
    */

    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    /**
    * Ngoài ra cách nữa là vẫn có thể dùng array.concat thay cho push như docs của Redux Toolkit ở trên vì push như đã nói nó sẽ thay đổi giá trị mảng trực tiếp, còn thằng concat thì nó merge - ghép mảng lại và tạo ra một mảng mới để chúng ta gán lại giá trị nên không vấn đề gì.
    */
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.column.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.column.concat([createdColumn._id])

    // setBoard(newBoard)
    //cập nhật dữ liệu board vào trong redux
    dispatch(updateCurrentActiveBoard(newBoard))

    // await createNewColumn(newColumnData)

    //đóng trạng thái thêm column mới và clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map(e => e._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden'
      }} >

        {columns?.map((value) => {
          //console.log(value)
          return <Column key={value._id} column={value} deleteCard = { deleteCard }/>
        })}

        {!openNewColumnForm
          ? <Box
            sx={{
              minWidth: '200px',
              height:'200px',
              mx: 2,
              borderRadius: '6px',
              bgcolor: '#fffffff3d'
            }}
          >
            <Button
              onClick={toggleOpenNewColumnForm}
              startIcon={<AddIcon/>}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 2.1,
                color:'white',
                bgcolor:'black'
              }} >
            Add New Column
            </Button>
          </Box>
          : <Box
            sx={{
              minWidth: '250px',
              maxWidth:'250px',
              mx: 2,
              p:1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap:1
            }}
          >
            <TextField
              label = 'Enter column title...'
              type='text'
              size='small'
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              variant='outlined'
              autoFocus
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap:'8px' }} >
              <Button
                className='interceptor-loading'
                onClick={addNewColumn}
                variant='contained'
                color='success'
                size='small'
                sx={{
                  boxShadow:'none',
                  border:'0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor:(theme) => theme.palette.success.main }
                }}>
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color:'white',
                  cursor:'pointer',
                  '&:hover': { color:(theme) => theme.palette.success.main }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }


      </Box>
    </SortableContext>

  )
}

export default ListColumns