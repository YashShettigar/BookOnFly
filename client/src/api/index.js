import axios from "axios";
import { useEffect, useState } from "react"

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const useFetch = (url) => {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await API.get(url);
                
                setData(res.data);
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [url]);
    
    const refetch = async () => {
        setLoading(true);
        try {
            const res = await API.get(url);

            setData(res.data);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { data, loading, error, refetch };
}


export const updateRoomUnavailability = (hotelid, roomid, dates) => API.patch(`/hotels/${hotelid}/rooms/availability/${roomid}`, dates);

export const login = async (credentials) => API.post("/users/login", credentials);
export const signup = async (credentials) => API.post("/users/signup", credentials);