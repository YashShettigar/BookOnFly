import { useContext, useState } from "react";
import { faBed, faCalendarDays, faCar, faPerson, faPlane, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRange } from 'react-date-range';
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';

import "./header.css";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { SearchContext } from "../../api/context";
import { AuthContext } from "../../api/auth";

const Header = ({ type }) => {
    const [ openDate, setOpenDate ] = useState(false);
    const [ destination, setDestination ] = useState("");
    const [ dates, setDates ] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    }]);
    const [ openOptions, setOpenOptions ] = useState(false);
    const [ options, setOptions ] = useState({
        adult: 1,
        children: 0,
        room: 1
    });

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleOption = ( name, operation )  => {
        setOptions(prev => (
            {
                ...prev, 
                [name]: operation === "i" ? options[name]+1 : options[name]-1 
            }
        ));
    };

    const { dispatch } = useContext(SearchContext);

    const handleSearch = () => {
        dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options }});
        navigate("/hotels", { state: {destination, dates, options} });
    }

    return (
        <div className="header">
            <div className={type === "list" ? "headerContainer listMode": "headerContainer"}>
                <div className="headerList">
                    <div className="headerListItem active">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Stays</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faPlane} />
                        <span>Flights</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faCar} />
                        <span>Car Rntals</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Attraction</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faTaxi} />
                        <span>Taxi</span>
                    </div>
                </div>
                {type !== "list" && <><h1 className="headerTitle">A lifetime of discounts? It's Genius.</h1>
                <p className="headerDesc">
                    Get rewarded for your travels. Unlock instant savings of 10% or more with a free BookOnFly account.
                </p>
                {!user && <button className="headerBtn">Sign In / Register</button>}
                <div className="headerSearch">
                    <div className="headerSearchItem">
                        <FontAwesomeIcon icon={faBed} className="headerIcon" />
                        <input type="text" placeholder="Where are you going?" className="headerSearchInput" onChange={e => setDestination(e.target.value)}/>
                    </div>
                    <div className="headerSearchItem">
                        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                        <span className="headerSearchText" onClick={() => setOpenDate(!openDate)}>{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
                        {openDate && <DateRange
                            editableDateInputs={true}
                            onChange={item => setDates([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={dates}
                            className="date" 
                            minDate={new Date()}
                        />}
                    </div>
                    <div className="headerSearchItem">
                        <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                        <span className="headerSearchText" onClick={() => setOpenOptions(!openOptions)}>{`${options.adult} Adults • ${options.children} Children • ${options.room} Room`}</span>
                        {openOptions && <div className="options">
                            <div className="optionItem">
                                <span className="optionText">Adults</span>
                                <div className="optionCounter">
                                    <button className="optionCounterBtn" onClick={() => handleOption("adult", "d")} disabled={ options.adult <= 1 }>-</button>
                                    <span className="optionCounterNumber">{options.adult}</span>
                                    <button className="optionCounterBtn" onClick={() => handleOption("adult", "i")}>+</button>
                                </div>
                            </div>
                            <div className="optionItem">
                                <span className="optionText">Children</span>
                                <div className="optionCounter">
                                    <button className="optionCounterBtn" onClick={() => handleOption("children", "d")} disabled={ options.children <= 0 }>-</button>
                                    <span className="optionCounterNumber">{options.children}</span>
                                    <button className="optionCounterBtn" onClick={() => handleOption("children", "i")}>+</button>
                                </div>
                            </div>
                            <div className="optionItem">
                                <span className="optionText">Room</span>
                                <div className="optionCounter">
                                    <button className="optionCounterBtn" onClick={() => handleOption("room", "d")} disabled={ options.room <= 1 }>-</button>
                                    <span className="optionCounterNumber">{options.room}</span>
                                    <button className="optionCounterBtn" onClick={() => handleOption("room", "i")}>+</button>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className="headerSearchItem">
                        <button className="headerBtn" onClick={handleSearch}>Search</button>
                    </div>
                </div></>}
            </div>
        </div>
    )
}

export default Header
