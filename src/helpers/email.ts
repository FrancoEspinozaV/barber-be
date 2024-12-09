import { Resend } from 'resend'
import { RESEND_API_KEY } from '../config/config'

const resend = new Resend(RESEND_API_KEY)
interface IEmail {
  from: string
  to: string
  subject: string
  html: string
}
export function sendNotifications({ from, to, subject, html }: IEmail) {
  try {
    resend.emails.send({
      from,
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.log('Error al enviar el email', error)
    return false
  }
}
