import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../api/context";
import { updateRoomUnavailability, useFetch } from "../../api/index";
import "./booking.css";

const Booking = ({ setOpen, hotelid }) => {
    const [ selectedRooms, setSelectedRooms ] = useState([]);
    const { data, loading, error } = useFetch(`/hotels/${hotelid}/rooms/all`);

    const { dates } = useContext(SearchContext);

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const date = new Date(start.getTime());
        let list = [];

        while (date <= end) {
            list.push(new Date(date).getTime());
            date.setDate(date.getDate()+1);
        }

        return list;
    }

    const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

    const isAvailable = (room) => {
        const isFound = room.unavailableDates.some(date => allDates.includes(new Date(date).getTime()));

        return !isFound;
    }

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;

        setSelectedRooms(checked ? [ ...selectedRooms, value ] : selectedRooms.filter(room => room !== value));
    }

    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            await Promise.all(selectedRooms.map(roomid => {
                const res = updateRoomUnavailability(hotelid, roomid, { dates: allDates });
                return res.data;
            }));
            setOpen(false);
            navigate("/");
        } catch (error) {
            
        }
    }

    return (
        <div className="booking">
            <div className="bContainer">
                <FontAwesomeIcon icon={faCircleXmark} className="bClose" onClick={() => setOpen(false)} />
                <span>Select your rooms:</span>
                { data.map((item, key) => (
                    <div className="bItem" key={key}>
                        <div className="bItemInfo">
                            <div className="bTitle">{item.title}</div>
                            <div className="bDesc">{item.description}</div>
                            <div className="bMax">
                                Max people: <b>{item.maxPeople}</b>
                            </div>
                            <div className="bPrice">{item.price}</div>
                        </div>
                        <div className="bSelectedRooms">
                            { item.roomNumbers.map(room => (
                                <div className="room" key={room._id}>
                                    <label>{room.number}</label>
                                    <input type="checkbox" value={room._id} onChange={handleSelect} disabled={!isAvailable(room)} />
                                </div>
                            )) }
                        </div>
                    </div>
                )) }
                <button className="bButton" onClick={handleClick} >Book now!</button>
            </div>
        </div>
    )
}

export default Booking
