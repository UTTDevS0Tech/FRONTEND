import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import type { Cita, DetalleCita, ServicioSeleccionado, DisponibilidadResponse} from '@/types'
import { useApiFetchDiego } from '@/composables/useApi'
import { watch } from 'vue'
export const useCitaStore = defineStore('citas', () =>  {

const horasDisponibles = ref<DisponibilidadResponse[]>([])
const cargarHoras = ref(false)
//nos traermos del bakend a los servicios y al peronal por q tenemos que hacer la cita, acuerdense
const {data:serviciosData, isFetching: cargandoServicios} = useApiFetchDiego('servicios').get().json()
const { data:personalData, isFetching: cargandoPersonal } = useApiFetchDiego('estilistas').get().json()
// aqui lke decimos a nuestro bakend con nuestro useFetch propio "compare traime esa informacion"


//luego pues obviamente creamos la cita pero para eso ya hice el type(interface pa q no batallen y poder tipear todo)

const nuevaCita = ref<Cita>({
    personal_id: null as any,
    fecha_c: '',
    hora_c: '',
    total: 0,
    apartado: 0,
    estado: 'pendiente',
    detalle_cita: [] //acuerdesne que es arreglos por q se pueden varios servicios y p;or q es un objeto tripo_servicio, precio_capturado etc

})
//no se necesita explicar vdd? es pa cuando se quiten los vlares por x o y razon
const limpiarCita = () => {
    nuevaCita.value = {
    personal_id: null as any,
    fecha_c: '',
    hora_c: '',
    total: 0,
    apartado: 0,
    estado: 'pendiente',
    detalle_cita: []

    }
}


//despues de esto pa mi lo mas complicado, el "carrito" de servicios q basicamente es por q pues ya saben son varios

const gestionarServicio =


 (servicio: any/*any es q es cualquier tipo de dato */) => {
    const lista = nuevaCita.value.detalle_cita
console.log("ESTO ES LO QUE HAY EN EL DETALLE DE LA CITA", nuevaCita.value.detalle_cita);
console.log("ESTO ES EL ID DEL SERVICIO QUE ME LLEGA", servicio.id);
    const servicioId = Number(servicio.id) //aqui lo convertimos a numero por q el id del servicio es un numero pero el valor que nos llega del select es un string, entonces lo convertimos a numero para que no haya problemas al compararlo
    const indice = lista.findIndex(item => item.tipo_servicio_id === servicioId)

 
    
    if(indice >-1) {
        lista.splice(indice, 1)
    } else {
        if(lista.length >= 3) {
            alert('tienes un max ed 3 servicios por cita')
            return;
        }

        lista.push ({
            tipo_servicio_id: servicioId,
            precio_capturado: Number(servicio.precio),
         // el backend me va a traer el id real de la cita
        })
    }
}
//pal que se pregunte por q .reduce q qes eso, basicamente es como el mapp, te agarra una propiedad de un objeto y en ves de quedarsela en un array lo que hace es
//eh coimpare de todos los valores que agarraste, sumamelos paro y asi jala, basicamente jalan igua la difernecia es q el map te los deja en el arrayt, el .reduce te los suma
//y la suma si lo quieren ver asi es una variuab le temporal que se va a ir sumando dependiendo 
// y el + NUmber es para converitr ejemplo "200" a 200   
 const totalCita = computed(() => {
        return nuevaCita.value.detalle_cita.reduce((suma, servicio)=> {
            return suma + Number(servicio.precio_capturado)
        }, 0)
    })




    const enviarCita = async() => {
        nuevaCita.value.total = totalCita.value;
        nuevaCita.value.apartado = totalCita.value * 0.20;
        
        const {data, error, response} = await useApiFetchDiego('citas').post(nuevaCita.value).json()

        if(response.value?.ok &&!error.value) {
            console.log("SI JALO FELICIDADES SI GUARDA", data.value)
            alert('cita agendada con exito')
            limpiarCita()
            return true;


        } else{

            const mensajeDelServiod = data.value?.message || 'Error al agendar la cita'
            console.log("ESTO ES EL ERROR", error.value)
            alert("no se pudo agendar la cita" + mensajeDelServiod)
            return false;
        }
    }

    watch (() => [nuevaCita.value.personal_id, nuevaCita.value.fecha_c], () => {

        if(nuevaCita.value.personal_id && nuevaCita.value.fecha_c) {
            obtenerDisponibilidad()
            
        } else {
            horasDisponibles.value = [];

        }
    });

    const obtenerDisponibilidad = async () => {
        if(!nuevaCita.value.personal_id || !nuevaCita.value.fecha_c) {
            return;
        }

        cargarHoras.value = true;
        nuevaCita.value.hora_c = '';

        try {
            const url = `citas/disponibilidad?personal_id=${nuevaCita.value.personal_id}&fecha=${nuevaCita.value.fecha_c}`;
            const { data, error } = await useApiFetchDiego(url).get().json();
       if(!error.value) {
        horasDisponibles.value = data.value.data
            cargarHoras.value = false;
       } else {
        horasDisponibles.value = []
console.log("ESTO ES EL ERROR AL OBTENER LA DISPONIBILIDAD", error.value)
        cargarHoras.value = false;

       }
        } catch (error) {
            console.log("ESTO ES EL ERROR AL OBTENER LA DISPONIBILIDAD", error)
            alert('Error al cargar las horas disponibles')
                cargarHoras.value = false;
        }

    }

    return {
        limpiarCita,
        serviciosData,
        personalData,
        cargandoServicios,
        cargandoPersonal,
        nuevaCita,
        gestionarServicio,
        totalCita,
        enviarCita,
        horasDisponibles,
        obtenerDisponibilidad,
        cargarHoras
    }

})

