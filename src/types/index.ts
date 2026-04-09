export interface Personal {
    id?: number
    nombre: string
    descripcion: string
    user_id: number
}


export interface ServicioSeleccionado {
   
    nombre: string;
    precio_capturado: number;
}

export interface User {
        id?: number
        email: string
        password: string
        activo?: boolean
        rol_id?: number
    }
    //tiene que quedar alodo de credenciales.password en v-model 

export interface Rol {
    id?: number
    nombre: string
    descripcion: string
}
/*
    public function up(): void
    {
            Schema::create('citas', function (Blueprint $table) {
            $table->id();
            $table->decimal('apartado', 10, 2)->default(0.00);
            $table->decimal('total', 10, 2)->nullable();
            $table->foreignId('personal_id')->constrained('personales')->onDelete('cascade');
            $table->time('hora_c');
            $table->date('fecha_c');
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada'])->default('pendiente');
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->timestamps();
        });
    }
*/

export interface Cita {
    id?: number;
    apartado?: number;
    total?: number;
    personal_id: number;
    hora_c: string;
    fecha_c: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada';
    cliente_id?: number;
    detalle_cita: DetalleCita[];

}

export interface DetalleCita{
    id?: number;
    cita_id?: number;
    tipo_servicio_id: number;
    precio_capturado: number;

}


export interface Cliente {
  id?: number
  nom: string
  apellido_p: string
  apellido_m: string
  tel?: string
  email?: string
  user_id?: number | null
}





/*

public function up(): void
    {
        Schema::create('detalle_citas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cita_id')->constrained('citas')->onDelete('cascade');
            $table->foreignId('tipo_servicio_id')->constrained('tipo_servicios')->onDelete('cascade');
            $table->decimal('precio_capturado' , 10, 2)->default(0);
            $table->timestamps();
        });
    }

   
    public function down(): void
    {
        Schema::dropIfExists('detalle_citas');

    }
};


*/

export interface Servicio {
  id?: number
  nombre: string
  precio?: number
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T> {
  status: string
  error: any
  data: T
  message: string | null
}

export interface TipoServicio {
  id: number
  nombre: string
  descripcion?: string | null
  precio: number
  tiempo_estimado: number
  activo: boolean
  servicio_id: number
  imagen?: string | File | null
}

export interface RegisterData {
  nom: string
  apellido_p: string
  apellido_m: string
  tel?: string
  email: string
  password: string
  password_confirmation: string
}

export interface Galeria {
  id?: number
  titulo: string
  imagen?: string
  imagen_url?: string | null
  created_at?: string
  updated_at?: string
}
//lo q me regresa el backend
export interface AdminUser{
id: number
email: string
activo: boolean
rol_id: number
}

export interface AdminUserPayload{
email:string
password: string
password_confirmation: string
activo?: boolean
rol_id?: number
}

export interface AdminUserUpdatePayload{
email?:string
password?: string
password_confirmation?: string
activo?: boolean
rol_id?: number
}
//lo q me regresa el backend 
export interface AdminPersonal{
id: number
nombre: string
descripcion: string
user_id: number
}

export interface AdminPersonalPayload {
  nombre: string
  descripcion: string
  user_id: number
}

export interface AdminPersonalUpdatePayload {
  nombre?: string
  descripcion?: string
  user_id?: number
}



// a ver q onda con esto, de una vez lo pongo pq no va a ser el diabolo
export interface HorarioPersonal {
  dia: string
  inicio: string
  fin: string
  activo: boolean
}



