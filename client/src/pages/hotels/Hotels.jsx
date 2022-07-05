import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '../../components/header/Header';
import Navbar from '../../components/navbar/Navbar';

import { useFetch } from '../../api/index.js';

import "./hotels.css";
import { DateRange } from 'react-date-range';
import SearchItem from '../../components/searchItem/SearchItem';

const Hotels = () => {
  const location = useLocation();
  const [ destination, setDestination ] = useState(location.state.destination);
  const [ dates, setDates ] = useState(location.state.dates);
  const [ openDate, setOpenDate ] = useState(false);
  const [ options, setOptions ] = useState(location.state.options);
  const [ min, setMin ] = useState(undefined);
  const [ max, setMax ] = useState(undefined);

  const { data, loading, error, refetch } = useFetch(`hotels/all?city=${destination}&min=${min || 0}&max=${max || 9999}`);

  const handleClick = () => {
    refetch();
  }

  return (
    <div>
      <Navbar />
      <Header type="list"/>
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="listTitle">Search</h1>
            <div className="listItem">
              <label>Destination</label>
              <input placeholder={destination} type="text" />
            </div>
            <div className="listItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && <DateRange 
                editableDateInputs={true}
                moveRangeOnFirs tSelection={false}
                onChange={item => setDates([item.selection])}
                minDate={new Date()}
                ranges = {dates}
              />}
            </div>
            <div className="listItem">
              <label>Options</label>
              <div className="listOptions">
                <div className="listOptionItem">
                  <span className="listOptionText">
                    Min Price <small>per night</small>
                  </span>
                  <input type="number" onChange={e => setMin(e.target.value)} placeholder="" className='listOptionInput'/>
                </div>
                <div className="listOptionItem">
                  <span className="listOptionText">
                    Max Price <small>per night</small>
                  </span>
                  <input type="number" onChange={e => setMax(e.target.value)} placeholder="" className='listOptionInput'/>
                </div>
                <div className="listOptionItem">
                  <span className="listOptionText" >
                    Adult
                  </span>
                  <input type="number" min={1} placeholder={options.adult} className='listOptionInput'/>
                </div>
                <div className="listOptionItem">
                  <span className="listOptionText">
                    Children
                  </span>
                  <input type="number" min={0} placeholder={options.children} className='listOptionInput'/>
                </div>
                <div className="listOptionItem">
                  <span className="listOptionText">
                    Room
                  </span>
                  <input type="number" min={1} placeholder={options.room} className='listOptionInput'/>
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            { loading ? "Loading..." : (<>
              {data.map(item => (
                <SearchItem key={item._id} item={item} />
              ))}
            </>)}    
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hotels;
