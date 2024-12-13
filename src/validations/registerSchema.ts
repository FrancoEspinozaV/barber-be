import { z } from 'zod'

export const registerSchema = z.object({
  first_name: z
    .string({
      required_error: 'El nombre es requerido',
    })
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres',
    })
    .max(20, {
      message: 'El nombre debe tener máximo 20 caracteres',
    }),
  last_name: z
    .string({
      required_error: 'El apellido es requerido',
    })
    .min(2, {
      message: 'El apellido debe tener al menos 2 caracteres',
    })
    .max(20, {
      message: 'El apellido debe tener máximo 20 caracteres',
    }),
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
  phone: z
    .string({
      required_error: 'El teléfono es requerido',
    })
    .regex(/^[0-9]{8}$/, {
      message: 'El teléfono debe tener 10 dígitos',
    }),
})
