import { Request, Response } from 'express'
import Barber, { IBarber } from '../models/Barber'

export const createBarber = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, phone, specialty } = req.body
    const barber: IBarber = new Barber({ name, phone, specialty })
    await barber.save()
    res.status(201).json(barber)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el barbero' })
  }
}

export const getBarbers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const barbers = await Barber.find()
    res.status(200).json(barbers)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los barberos' })
  }
}
