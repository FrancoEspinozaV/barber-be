import { Resend } from 'resend'
import { RESEND_API_KEY } from '../config/config'

const resend = new Resend(RESEND_API_KEY)

interface IEmail {
  from: string
  to: string
  subject: string
  html: string
}

export async function sendNotifications({ from, to, subject, html }: IEmail) {
  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Error al enviar el email', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error al enviar el email', error)
    return false
  }
}
