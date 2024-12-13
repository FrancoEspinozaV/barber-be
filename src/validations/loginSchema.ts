import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'El email es requerido',
    })
    .email({
      message: 'El email no es válido',
    }),
  password: z
    .string({
      required_error: 'La contraseña es requerida',
    })
    .min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    })
    .max(20, {
      message: 'La contraseña debe tener máximo 20 caracteres',
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/, {
      message:
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
    }),
})
