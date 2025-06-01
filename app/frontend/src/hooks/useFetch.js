import { useState, useEffect } from "react";

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la petición");
            }
            return response.json();
        })
        .then((data) => setData(data))
        .catch((error) => {
            console.error("Error en useFetch:", error);
            setError(error);
        });
    }, [url]);
    return { data, error };
}
