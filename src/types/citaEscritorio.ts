export interface DetalleCitaPayload {
  servicio_id: number
  subtotal: number
}

export interface CitaEscritorioPayload {
  total: number
  personal_id: number
  hora_c: string
  fecha_c: string
  estado?: string
  cliente_id: number
  detalles: DetalleCitaPayload[]
}

export interface ServicioOption {
  id: number
  nombre: string
  precio: number
}

export interface PersonalOption {
  id: number
  nombre: string
}

export interface ClienteOption {
  id: number
  nombre: string
}

export interface FormularioDetalleCita {
  servicio_id: number | null
  subtotal: number
}

export interface FormularioCitaEscritorio {
  total: number
  personal_id: number | null
  hora_c: string
  fecha_c: string
  estado: string
  cliente_id: number | null
  detalles: FormularioDetalleCita[]
}

export interface DetalleCitaTicket {
  servicio: string
  precio_capturado: string
}

export interface CitaEscritorioResponse {
  id: number
  apartado: string
  total: string
  personal: string
  hora_c: string
  hora_fin?: string
  fecha_c: string
  estado: string
  cliente: string
  detalle_cita: DetalleCitaTicket[]
}
