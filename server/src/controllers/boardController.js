/*eslint-disable no-console  */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    console.log( 'req.body:', req.body)
    // console.log( 'req.query:' + req.query)
    // console.log( 'req.params:' + req.params)
    // console.log( 'req.files:' + req.files)
    // console.log( 'req.cookies:' + req.cookies)
    // console.log( 'req.jwtDecoded:' + req.jwtDecode)

    const userId = req.jwtDecoded._id
    console.log(userId)


    //Điều hướng dữ liệu sang tầng service
    const createdBoard = await boardService.createNew(userId, req.body)

    //có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    // console.log( 'req.params:' + req.params)
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    //Điều hướng dữ liệu sang tầng service
    const board = await boardService.getDetails(userId, boardId)
    //có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    // console.log( 'req.params:' + req.params)
    const boardId = req.params.id
    //Điều hướng dữ liệu sang tầng service
    const updatedBoard = await boardService.update(boardId, req.body)
    //có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // page và itemsPerPage được truyền vào trong query url từ phía FE nên BE sẽ lấy thông qua req.query
    const { page, itemsPerPage, q } = req.query
    const queryFilters = q
    // console.log(queryFilters)

    const results = await boardService.getBoards(userId, page, itemsPerPage, queryFilters)

    res.status(StatusCodes.OK).json(results)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    //Điều hướng dữ liệu sang tầng service
    const result= await boardService.moveCardToDifferentColumn(req.body)
    console.log(result)
    //có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  getBoards,
  moveCardToDifferentColumn
}