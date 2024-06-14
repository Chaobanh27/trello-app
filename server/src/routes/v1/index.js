import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute.js'
import { cardRoute } from './cardRoute'
import { userRoute } from './userRoute'
import { invitationRoute } from '~/routes/v1/invitationRoute'

const Router = express.Router()

//Check APIs v1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' })
})

//board APIs
Router.use('/boards', boardRoute)

//Column APIs
Router.use('/columns', columnRoute)

//Card APIs
Router.use('/cards', cardRoute)

//User APIs
Router.use('/users', userRoute)

/** Invitation APIs */
Router.use('/invitations', invitationRoute)

export const APIs_V1 = Router