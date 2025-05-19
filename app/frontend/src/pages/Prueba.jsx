import { useFetch } from '../hooks/useFetch'
import { Boton } from '../components/Boton'

export const Prueba = () => {
    const {data, error} = useFetch("http://localhost:5000/api/alumnos")

    return (
        <>
            <div>
                <h1>Consumiendo api de Flask</h1>
                <div>
                    <ul>
                        {error && <li>Error: {error}</li>}
                        {data?.map((alumno) => (<li key={alumno.id_alumno}>{alumno.nombre}</li>))}
                    </ul>
                </div>
            </div>
            <Boton/>
        </>
    )
}
export default Prueba