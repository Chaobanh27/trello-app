import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '../../utils/constants'
import { isEmpty } from 'lodash'
import { mapOrder } from '../../utils/sort'
import { generatePlaceHolderCard } from '../../utils/formatter'
import authorizedAxiosInstance from '../../utils/authorizeAxios'

//khởi tạo giá trị state của một cái Slice trong redux
const initialState = {
  currentActiveBoard: null
}
// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk

export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return res.data
  }
)

//Khởi tạo slice trong kho lu=u tru redux trong redux
export const activeBoardSlice = createSlice({
  name:'activeBoard',
  initialState,
  //Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    // Lưu ý luôn là ở đây cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer,
      //ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const fullBoard = action.payload

      //xử lý dữ liệu nếu cần thiết
      // ...

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = fullBoard
    }
  },
  //Extra Reducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
    //action.payload ở đây sẽ là res.data
      let board = action.payload

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        }
        else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}


// Cái file này tên là activeBoardSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer, mọi người lưu ý :D
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer