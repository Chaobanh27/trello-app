/* eslint-disable no-console */
import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  //closestCenter,
  pointerWithin,
  //rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '../../../customLibraries/DndKitSensors'
import { mapOrder } from '../../../utils/sort'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import { cloneDeep, isEmpty } from 'lodash'
import TrelloCard from './ListColumns/Column/ListCards/Card/Card'
import { generatePlaceHolderCard } from '../../../utils/formatter'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, moveColumns, moveCardIntheSameColumn, moveCardToDifferentColumn, deleteCard }) {
  //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  //yeu cau di chuot 10px thi moi kich hoat event, fix truong hop click bi goi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  //nhan giu 250ms va dung sai cua cam ung(di chuyen chenh lech 5px ) thi moi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  //const sensots = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  //cung mot thoi diem chi co 1 phan tu dang duoc keo (column hoac card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  //diem va cham cuoi cung (xu ly phat hiem va cham)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //tim column theo cardId
  const findColumnByCardId = (cardId) => {
    //doan nay can luu y nen dung c.card thay vi c.cardOrderIds boi vi o buoc handleDragOver chung ta se
    //lam du lieu cho cards hoan chinh truoc roi moi tao ra cardOrderIds moi
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  //console.log(orderedCards)
  //console.log(orderedColumns)

  //function chung xu ly cap nhat lai state trong truong hop di chuyen card giua ca column khac nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns(prevColumns => {
      //tim vi tri (index) cua cai overCard trong column dich ( noi ma activeCard sap duoc tha)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      //logic tinh toan 'cardIndex moi' (tren hoac duoi cua overCard) lay chuan ra tu code thu vien
      const isBelowOverItem =
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      let newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //Clone mang orderedColumns ra mot cai moi de xu ly data roi return - cap nhat lai orderedColumns moi
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      //column cu
      if (nextActiveColumn) {
        //xoa card o cai column active ( column cu,luc ma keo card ra khoi no de sang column moi)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        if ( isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceHolderCard(nextActiveColumn)]
        }

        //cap nhat lai mang cardOrderIds cho dung du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      //column moi
      if (nextOverColumn) {
        //kiem tra xem card dang keo co ton tai o overColumn chua neu co thi can xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //doi voi truong hop dragEnd thi phai cap nhat lai dung du lieu columnId trong card sau khi keo card giua 2 column khac nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        //tiep theo la them card dang keo vao overColumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex, 0, rebuild_activeDraggingCardData
        )

        // Xóa cái Placeholder Card đi nếu nó đang tồn tại (Video 37.2)
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_Placeholder)
        console.log(nextOverColumn.cards)

        //cap nhat lai mang cardOrderIds cho dung du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      //nếu function này được gọi từ handleDragEnd thì nghĩa là đã kéo xong, lúc này mới xử lý API tại đây
      //phải dùng tới activeDragItemData.columnId hoặc tốt nhất là oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart)
      //chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver và tới đây là state của card đã bị cập nhật 1 lần rồi
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        )
      }
      //console.log(nextColumns)
      return nextColumns
    })
  }

  //Trigger khi bat dau keo mot phan tu
  const handleDragStart = (event) => {
    console.log(event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //neu la keo card thi moi thuc hien set gia tri oldColumnWhenDraggingCard
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  //trigger trong qua trinh keo phan tu
  const handleDragOver = (event) => {
    //khong lam gi them neu keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event


    //kiem tra neu khong ton tai active hay over (keo ra ngoai container) thi khong lam gi
    if (!active || !over) return

    //activeDragging: la card dang keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    //tim 2 cai column theo card Id
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    //neu khong ton tai 1 trong 2 column thi khong lam gi het,tranh crash trang web
    if (!activeColumn || !overColumn) return

    //xu ly logic o day chi khi keo card qua 2 column khac nhau, con keo theo card trong chinh column ban dau cua no thi khong lam gi
    //vi day dang la doan xu ly luc keo (handleDragOver), con xu ly luc keo xong xuoi thi no lai la van de khac o (handleDragEnd)
    if (activeColumn._Id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }

  }

  //Trigger khi ket thuc keo mot phan tu
  const handleDragEnd = (event) => {
    //console.log(event)
    const { active, over } = event
    //kiem tra neu khong ton tai over (keo ra khoai pham vi hoat dong thi return de tranh loi)
    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //console.log('Keo card')

      //activeDragging: la card dang keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      //tim 2 cai column theo card Id
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      //console.log(oldColumnWhenDraggingCard)

      //neu khong ton tai 1 trong 2 column thi khong lam gi het,tranh crash trang web
      if (!activeColumn || !overColumn) return

      //xu ly keo tha card giua 2 column khac nhau
      //phai dung toi activeDragItemData.columnId hoac oldColumnWhenDraggingCard._id (set vao satte tu buoc handleDragStart) chu khong phai activeData
      //trong scope handleDragEnd nay vi sau khi da qua onDragOver toi day la state cua card da cap nhat 1 lan roi
      //console.log(activeDragItemData)
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //console.log('khac column')
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      }
      //xu ly keo tha card trong cung column
      else {
        //lay vi tri cu (tu thang oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        //lay vi tri moi (tu thang over)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        //console.log('oldcardindex:', oldCardIndex)
        //console.log('newcardindex:', newCardIndex)

        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)
        console.log(dndOrderedCards)
        // console.log(dndOrderedCardIds)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)

          //tim toi column ma chung ta dang tha
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          //cap nhat lai 2 gia tri moi la card va cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          //console.log(targetColumn)

          return nextColumns
        })

        moveCardIntheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    //xu ly keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //console.log('Keo column')
      if (active.id !== over.id) {
        //lay vi tri cu (tu thang active)
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        //lay vi tri moi (tu thang over)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        //console.log('oldColumnIndex:', oldColumnIndex)
        //console.log('newColumnIndex:', newColumnIndex)
        //dung arrayMove cua DnD-kit de sap xep lai mang Column ban dau
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        //gọi update state ở đây để tránh delay hoặc flickering giao diện lúc kéo thả khi phải chờ gọi API
        //cập nhật lại state column ban đầu sau khi kéo thả
        setOrderedColumns(dndOrderedColumns)
        moveColumns(dndOrderedColumns)
      }
    }

    //du lieu sau khi keo tha luon phai dua ve null
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } }
    })
  }

  const collisionDetectionStrategy = useCallback((args) => {

    //truong hop keo column thi dung thaut toan closestCorner la tot nhat
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    const pointerIntersections = pointerWithin(args)

    if (!pointerIntersections.length) return

    //thua toan phat hien va cham tra ve mang cac va cham (khong can nua)
    //const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)

    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      //fix flickering
      //neu cai over no la column thi se tim toi cai cardId gan nhat ben trong khu vuc
      // va cham do dua vao thuat toan phat hien va cham closeCenter hoac closeCorners deu duoc,
      //tuy nhien o day dung closestCenter la tot nhat

      const checkColumn = orderedColumns.find(colum => colum._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    //neu overId la null thi tra ve mang rong - tranh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  //console.log(orderedColumns)

  //sensors được sử dụng để xác định các thiết bị nhập vào mà bạn muốn hỗ trợ (chuột, cảm ứng)
  //collisionDetection là hàm xác định khi nào một đối tượng được coi là va chạm với một đối tượng khác trong quá trình kéo.
  return (
    <>
      <DndContext
        collisionDetection = {collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        //neu chi dung closestCorners se co bug flickering
        //collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        sensors={sensors}>
        <Box sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0096FF'),
          width:'100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}>

          <ListColumns columns={orderedColumns} deleteCard = { deleteCard }/>
          <DragOverlay dropAnimation={dropAnimation}>
            {(!activeDragItemType) && null}
            {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
            {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <TrelloCard card={activeDragItemData} />}
          </DragOverlay>
        </Box>
      </DndContext>

    </>
  )
}

export default BoardContent