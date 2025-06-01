import { useState } from "react";

export const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async (nombre_usuario, contraseña) => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    nombre_usuario: nombre_usuario,
                    contraseña: contraseña
                })
            })

            const data = await response.json() //respuesta JSON del server

            if(response.ok && data.access_token){
                localStorage.setItem('token', data.access_token)
                localStorage.setItem('nombre_usuario', data.nombre_usuario)
                localStorage.setItem('rol', data.rol)
                return data
            } else {
                setError(data.msg || 'Error al iniciar sesión')
                return null
            }
        } catch (err) {
                setError('Error de red o servidor')
                console.error("Error en la petición:", err)
                return null
            } finally {
                setLoading(false)
            }
    }

    return { login, loading, error }
}