import { Request, Response } from 'express'
import { loginSchema } from '../validations/loginSchema'
import User from '../models/User'
import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config'
import { IResponse } from '../Interface/response'
import { registerSchema } from '../validations/registerSchema'
import { sendNotifications } from '../helpers/email'
import { endpointRoute } from '../routes/endpointRoute'
import { ZodError } from 'zod'

interface ILogin {
  email: string
  uuid: string
  name: string
}

function validationsLogin(
  email: string,
  password: string
): IResponse<undefined> {
  if (!email) {
    const reponse = {
      status: false,
      message: 'El email es requerido',
    }
    return reponse
  }

  if (!password) {
    const reponse = {
      status: false,
      message: 'La contraseña es requerida',
    }
    return reponse
  }

  return {
    status: true,
    message: 'OK',
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = req.body
    const { email, password } = body

    const validations = validationsLogin(email, password)
    if (!validations.status) {
      res.status(400).json(validations)
      return
    }

    loginSchema.parse(body)

    const response = await loginUser({ email, password })

    if (!response.status || !response.data) {
      res.status(400).json(response)
      return
    }

    const token = jwt.sign(
      {
        id: response.data.uuid,
      },
      JWT_SECRET,
      {
        expiresIn: '2d',
      }
    )

    res.cookie('token', token)

    res.status(200).json(response)
    return
  } catch (error) {
    const reponse: IResponse<undefined> = {
      status: false,
      message: 'Error al iniciar sesión',
    }
    res.status(500).json(reponse)
    return
  }
}

async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<IResponse<ILogin>> {
  const user = await User.findOne({ email })

  if (!user) {
    const reponse = {
      status: false,
      message: 'El usuario no existe',
    }
    return reponse
  }

  if (!user.isVerified) {
    const reponse = {
      status: false,
      message: 'El usuario no ha sido verificado',
    }
    return reponse
  }

  const passwordEncrypted = user.password
  const passwordMatch = await compare(password, passwordEncrypted)

  if (!passwordMatch) {
    const reponse = {
      status: false,
      message: 'Contraseña incorrecta',
    }
    return reponse
  }

  const { uuid, name, email: userEmail, phone } = user

  const response = {
    status: true,
    message: 'Inicio de sesión exitoso',
    data: {
      uuid,
      name,
      email: userEmail,
      phone,
    },
  }

  return response
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token')
  const response: IResponse<undefined> = {
    status: true,
    message: 'Cierre de sesión exitoso',
  }
  res.status(200).json(response)
}

export async function forgetToken(req: Request, res: Response) {
  try {
    const { email } = req.body
    const host = req.get('host') || 'http://localhost:3000'
    const responseToken = await generateToken(email, host)
    res.status(400).json(responseToken)
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error al enviar el email: ${error}`,
    })
  }
}

async function generateToken(email: string, host: string) {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '20m' })
  const validationUrl = `${host}${endpointRoute.auth.verifyEmail.absolute}?token=${token}`

  const isSend = await sendNotifications({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Bienvenido a la barbería',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a la Barbería</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #333333; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Bienvenido a la Barbería</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; color: #333333;">
        <p style="margin: 0 0 15px; font-size: 16px;">Gracias por unirte a nuestra comunidad.</p>
        <p style="margin: 0 0 20px; font-size: 16px;">Para verificar tu cuenta, haz clic en el siguiente botón:</p>
        <a href="${validationUrl}" style="padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #007bff; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${validationUrl}"> Desarrollador/a </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; color: #666666; font-size: 14px;">
        <p style="margin: 0;">Este enlace expira en <strong>20 minutos</strong>.</p>
        <p style="margin: 10px 0 0;">Si no realizaste esta solicitud, puedes ignorar este mensaje.</p>
        <p style="margin: 10px 0 0;">Si el boton no funciona copia y pega este enlace en tu navegador: ${validationUrl}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; text-align: center; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; color: #999999; font-size: 12px;">
        <p style="margin: 0;">&copy; 2024 La Barbería. Todos los derechos reservados.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  })

  if (!isSend) {
    return {
      status: false,
      message: 'Error al enviar el email',
    }
  }

  return {
    status: true,
    message: 'Email enviado exitosamente',
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { body } = req
    registerSchema.parse(body)

    const { email, first_name, last_name, password, phone } = body

    const hashedPassword = await hash(password, 10)
    const user = await User.create({
      email: email.toLowerCase(),
      uuid: crypto.randomUUID(),
      name: `${first_name} ${last_name}`,
      password: hashedPassword,
      phone,
      isValid: false,
    })

    const host = req.get('host') || 'http://localhost:3000'
    const responseToken = await generateToken(user.email, host)

    if (!responseToken.status) {
      res.status(400).json(responseToken)
      return
    }

    const response = {
      status: true,
      message: 'Registro exitoso. Se ha enviado un email de validación.',
      data: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    }

    res.status(201).json(response)
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.message} en el campo ${err.path.join('.')}`)
        .join(', ')
      const response: IResponse<undefined> = {
        status: false,
        message: `Error al registrar el usuario:\n ${errorMessages}`,
      }
      res.status(400).json(response)
      return
    }

    // Si no es un error de Zod, mostrar el error general
    const response: IResponse<undefined> = {
      status: false,
      message: `Error al registrar el usuario: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    }
    res.status(500).json(response)
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.query

    if (!token) {
      res.status(400).json({
        status: false,
        message: 'Token no proporcionado',
      })
      return
    }

    const decoded: any = jwt.verify(token as string, JWT_SECRET)
    const { email } = decoded

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    )

    if (!user) {
      res.status(404).json({
        status: false,
        message: 'Usuario no encontrado',
      })
      return
    }

    res.redirect('https://www.google.com')
  } catch (error) {
    console.error(error)
    res.status(400).json({
      status: false,
      message: 'Error al verificar el correo',
    })
  }
}
