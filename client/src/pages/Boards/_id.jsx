/* eslint-disable no-console */
import { Container } from '@mui/material'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
//import { mockData } from '../../apis/mock-data'
import {
  //fetchBoardDetailsAPI,
  updateColumnDetailsAPI,
  updateBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteCardAPI } from '../../apis'
import { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { toast } from 'react-toastify'
import { fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '../../redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '../../components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function Board() {
  const dispatch = useDispatch()
  //không dùng state của component nữa mà dùng state của redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)

  const { boardId } = useParams()

  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
    //call API
    // fetchBoardDetailsAPI(boardId)
    //   .then(board => {
    //     board.columns.forEach(column => {
    //       if (isEmpty(column.cards)) {
    //         column.cards = [generatePlaceHolderCard(column)]
    //         column.cardOrderIds = [generatePlaceHolderCard(column)._id]
    //       }
    //     })
    //     setBoard(board)
    //   })
  }, [dispatch, boardId])

  //hàm này dùng để gọi API tạo mới Column và làm lại dữ liệu state board
  // const createNewColumn = async (newColumnData) => {
  //   const createdColumn = await createNewColumnAPI({
  //     ...newColumnData,
  //     boardId: board._id
  //   })
  //   //console.log(createdColumn)
  //   createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
  //   createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]

  //   //update state board

  /*
     * Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spread operator là Shallow Copy/Clone,
     * nên dính phải rules Immutability trong Redux Toolkit không dùng được hàm PUSH (sửa giá trị mảng trực tiếp),
     * cách đơn giản nhanh gọn nhất ở trường hợp này của chúng ta là dùng tới Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn.
     * https://redux-toolkit.js.org/usage/immer-reducers
     * Tài liệu thêm về Shallow và Deep Copy Object trong JS:
     * https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
  */

  //   // const newBoard = { ...board }
  //   const newBoard = cloneDeep(board)
  //   newBoard.columns.push(createdColumn)
  //   newBoard.columnOrderIds.push(createdColumn._id)

  /*
    * Ngoài ra cách nữa là vẫn có thể dùng array.concat thay cho push như docs của Redux Toolkit ở trên vì push như đã nói nó sẽ thay đổi giá trị mảng trực tiếp,
    * còn thằng concat thì nó merge - ghép mảng lại và tạo ra một mảng mới để chúng ta gán lại giá trị nên không vấn đề gì.
  */

  //   // const newBoard = { ...board }
  //   // newBoard.columns = newBoard.columns.concat([createdColumn])
  //   // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])
  //   // const newBoard = { ...board }
  //   // newBoard.columns = newBoard.column.concat([createdColumn])
  //   // newBoard.columnOrderIds = newBoard.column.concat([createdColumn._id])

  //   // setBoard(newBoard)
  //   dispatch(updateCurrentActiveBoard(newBoard))
  // }

  //hàm này dùng để gọi API tạo mới Card và làm lại dữ liệu state board
  // const createNewCard = async (newCardData) => {
  //   const createdCard = await createNewCardAPI({
  //     ...newCardData,
  //     boardId: '655661e4a79869e31e9cb1bc'
  //   })
  //   //console.log(createdCard)

  //   //update state board
  //   // Tương tự hàm createNewColumn nên chỗ này dùng cloneDeep
  //   // const newBoard = { ...board }
  //   const newBoard = cloneDeep(board)
  //   const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
  //   if (columnToUpdate) {
  //     if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
  //       columnToUpdate.cards = [createdCard]
  //       columnToUpdate.cardOrderIds = [createdCard._id]
  //     }
  //     else {
  //       columnToUpdate.cards.push(createdCard)
  //       columnToUpdate.cardOrderIds.push(createdCard._id)
  //     }

  //   }
  //   // setBoard(newBoard)
  //   dispatch(updateCurrentActiveBoard(newBoard))
  // }

  //chỉ cần gọi API để cập nhật mảng columnOrderIds của board chứa nó (thay đổi vị trí trong mảng)
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
    /**
    * Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây
    * chúng ta không dùng push như ở trên làm thay đổi trực tiếp kiểu mở rộng mảng,
    * mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi :))
    */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    //gọi api update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  //chỉ cần gọi API để cập nhật mảng cardOrderIds của column chứa nó (thay đổi vị trí trong mảng)
  const moveCardIntheSameColumn = async (dndOrderedCards, dndOrderedCardIds, columnId) => {
    /**
    * Cannot assign to read only property 'cards' of object
    * Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only - (nested object - can thiệp sâu dữ liệu)
    */

    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds

      //console.log(columnToUpdate.cards)
      //console.log(columnToUpdate.cardOrderIds)
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    //gọi API update column
    await updateColumnDetailsAPI(columnId, { cardOrderIds : dndOrderedCardIds })

  }

  // Khi di chuyển card sang column khác
  // B1 : cập nhật mảng cardOrderIds của column ban đầu chứa nó ( xóa cái id của card đó ra khỏi mảng )
  // B2 : cập nhật mảng cardOrderIds của column tiếp theo ( thêm id của card đó vào mảng )
  // B3 : cập nhật lại trường columnId mới của card đã kéo
  // => làm API hỗ trợ riếng

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumn) => {
    //update cho đúng dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumn.map(c => c._id)
    // Tương tự đoạn xử lý chỗ hàm moveColumns nên không ảnh hưởng Redux Toolkit Immutability gì ở đây cả.
    const newBoard = { ...Board }
    newBoard.columns = dndOrderedColumn
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    //gọi API xử lý
    let prevCardOrderIds = dndOrderedColumn.find(c => c._id === prevColumnId)?.cardOrderIds
    let nextCardOrderIds = dndOrderedColumn.find(c => c._id === nextColumnId)?.cardOrderIds
    //xử lý lỗi khi kéo tất cả card ra khỏi column, column rỗng mặc định sẽ có placeholder card,cần xóa nó đi trước khi gửi dữ liệu lên BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    // if (nextCardOrderIds[0].includes('placeholder-card')) {
    //   console.log(nextCardOrderIds)
    //   nextCardOrderIds.shift()
    // }

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds
    })
  }

  //xóa một column và cards bên trong nó
  // const deleteColumnDetails = (columnId) => {
  //   //console.log(columnId)
  //   //update cho đúng dữ liệu state board
  //   // Tương tự đoạn xử lý chỗ hàm moveColumns nên không ảnh hưởng Redux Toolkit Immutability gì ở đây cả.
  //   const newBoard = { ...board }
  //   newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
  //   newBoard.columnOrderIds = newBoard.columnOrderIds.filter(c => c !== columnId)
  //   // setBoard(newBoard)
  //   dispatch(updateCurrentActiveBoard(newBoard))
  //   //gọi API xử lý
  //   deleteColumnDetailsAPI(columnId).then(res => {
  //     //console.log(res)
  //     toast.success(res?.deleteResult)
  //   })
  // }

  //xóa một card
  const deleteCard = (cardId) => {
    //update cho đúng dữ liệu state board
    //Tương tự đoạn xử lý chỗ hàm moveColumns nên không ảnh hưởng Redux Toolkit Immutability gì ở đây cả.
    const newBoard = { ...board }
    newBoard.columns.map(c => {
      let findCard = c.cards.findIndex(e => e._id == cardId )
      if (findCard !== -1) {
        c.cards.splice(findCard, 1)
      }
    })
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    //gọi API xử lý
    deleteCardAPI(cardId).then(res => {
      //console.log(res)
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <PageLoadingSpinner caption="Loading Board..." />
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ minHeight:'100vh', backgroundColor:'black' }}>
      {/* Modal Active Card, check đóng/mở dựa theo cái State isShowModalActiveCard lưu trong Redux */}
      <ActiveCard />

      {/* Các thành phần còn lại của Board Details */}
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        board={board}
        // createNewColumn = { createNewColumn }
        // createNewCard = { createNewCard }
        // deleteColumnDetails = { deleteColumnDetails }
        // 3 cái trường hợp move dưới đây thì giữ nguyên để code xử lý kéo thả ở phần BoardContent không bị quá dài mất kiểm soát khi đọc code, maintain.
        moveColumns = { moveColumns }
        moveCardIntheSameColumn = { moveCardIntheSameColumn }
        moveCardToDifferentColumn = { moveCardToDifferentColumn }

        deleteCard = { deleteCard }
      />
    </Container>
  )
}

export default Board