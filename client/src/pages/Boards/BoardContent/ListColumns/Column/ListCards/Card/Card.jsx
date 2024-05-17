/* eslint-disable no-console */
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import DeleteIcon from '@mui/icons-material/Delete'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useConfirm } from 'material-ui-confirm'

function TrelloCard({ card, deleteCard }) {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: card._id, data: { ...card } })
  const dndKitCardStyles = {
    //touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? ' 3px solid #0096FF' : undefined
  }

  const confirmDeletecard = useConfirm()
  const handleDeleteCard = () => {
    confirmDeletecard({
      title:'Delete card ?',
      description: 'This action will delete your card! are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'

      // description: 'please write down card to confirm ',
      // confirmationKeyword: 'card'
    })
      .then(() => {
        deleteCard(card._id)
        // console.log(card._id)
        // console.log(card.title)
      })
      .catch(() => {})
  }
  return (
    <Card
      ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        overflow:'unset',
        display: card?.FE_Placeholder ? 'none' : 'block',
        '&:hover': { color:(theme) => theme.palette.primary.main }
      }}>
      {card?.cover &&
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image={card?.cover}
            />
      }

      <CardContent sx={{ p : 1.5, '&:last-child': { p:1.5 }, display:'flex', justifyContent:'space-between' }}>
        <Typography variant="h5" component="div" sx={{
          minWidth: '180px',
          wordWrap:'break-word'
        }}>
          {card?.title}
        </Typography>
        <Button onClick={handleDeleteCard} size="small"><DeleteIcon/></Button>
      </CardContent>
    </Card>
  )
}

export default TrelloCard