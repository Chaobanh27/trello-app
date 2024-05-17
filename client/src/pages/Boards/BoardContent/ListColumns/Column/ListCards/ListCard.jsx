/* eslint-disable no-console */
import { Box } from '@mui/material'
import TrelloCard from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

function ListCard({ cards, deleteCard }) {
  //console.log(cards)
  return (
    <SortableContext items={cards ? cards.map(e => e._id) : []} strategy={verticalListSortingStrategy}>
      <Box sx={{
        p: '0 5px 5px 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) =>
          `calc(${theme.trello.boardContentHeight} - 
          ${theme.spacing(5)} -
          ${COLUMN_HEADER_HEIGHT} - 
          ${COLUMN_FOOTER_HEIGHT}
          )`
      }}>
        {cards?.map(card => <TrelloCard key={card._id} card={card} deleteCard = { deleteCard } /> )}
      </Box>
    </SortableContext>

  )
}

export default ListCard