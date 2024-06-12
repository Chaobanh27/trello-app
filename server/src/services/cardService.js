/*eslint-disable no-console  */
/*eslint-disable no-useless-catch*/
import { StatusCodes } from 'http-status-codes'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    //xử lý logic dữ liệu tùy đặc thù dự án
    const newCard = {
      ...reqBody
    }

    //gọi tới tầng model để lưu bản ghi vào database
    const createdCard = await cardModel.createNew(newCard)
    //gọi tới model để tìm id vừa mới tạo và trả về thông tin mới tạo
    const findOneById = await cardModel.findOneById(createdCard.insertedId)

    //xử lý cấu trúc data ở đây trước khi trả dữ liệu về
    if (findOneById) {
      //update mảng cardOrderIds trong collection columns
      await columnModel.pushCardOrderIds(findOneById)
    }
    //trả về thông tin mới tạo
    return findOneById
  } catch (error) {
    /*
    Được sử dụng trong các hàm bình thường (không phải middleware) để ném lỗi và
    dừng luồng thực thi hiện tại. Khi một lỗi được ném, nó sẽ được nắm bắt bởi khối catch gần nhất hoặc
    nếu không có khối catch, nó sẽ làm dừng chương trình và hiển thị thông báo lỗi.
     */
    throw error
  }
}

const update = async (cardId, reqBody, cardCoverFile) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    let updatedCard = {}

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      updatedCard = await cardModel.update(cardId, { cover: uploadResult.secure_url })
    } else {
      // Các trường hợp update chung như title, description
      updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  } catch (error) { throw error }
}

const deleteItem = async (cardId) => {
  try {
    const targetCard = await cardModel.findOneById(cardId)
    if (!targetCard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'card not found')
    }
    //xóa card
    await cardModel.deleteOneById(cardId)

    //xóa cardId trong cardOrderIds của column chứa nó
    await columnModel.pullColumnOrderIds(targetCard)

    return { deleteResult: 'Card has been deleted successfully' }
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update,
  deleteItem
}

