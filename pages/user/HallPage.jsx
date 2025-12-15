import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../../services/api';
import { useData } from '../../contexts/DataContext';

const Seat = ({ type, onClick, isSelected }) => {
  const baseClasses = 'w-4 h-4 sm:w-6 sm:h-6 rounded-sm m-1';
  const selectedClasses = 'ring-2 ring-teal-400 ring-offset-2 ring-offset-gray-800';
  let typeClasses = '';

  switch (type) {
    case 'standart':
      typeClasses = 'bg-white hover:bg-gray-300 cursor-pointer';
      break;
    case 'vip':
      typeClasses = 'bg-orange-400 hover:bg-orange-500 cursor-pointer';
      break;
    case 'taken':
      typeClasses = 'bg-gray-600 cursor-not-allowed';
      break;
    case 'disabled':
      typeClasses = 'bg-transparent cursor-not-allowed';
      break;
    default:
      break;
  }

  return <div className={`${baseClasses} ${typeClasses} ${isSelected ? selectedClasses : ''}`} onClick={type === 'standart' || type === 'vip' ? onClick : undefined} />;
};

const HallPage = () => {
  const { seanceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { halls, films, seances } = useData();
  const [hallConfig, setHallConfig] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const selectedDateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const seanceInfo = useMemo(() => {
    if (!seanceId) return null;
    const seance = seances.find(s => s.id === +seanceId);
    if (!seance) return null;
    const film = films.find(f => f.id === seance.seance_filmid);
    const hall = halls.find(h => h.id === seance.seance_hallid);
    return { seance, film, hall };
  }, [seanceId, seances, films, halls]);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!seanceId) return;
      try {
        setLoading(true);
        const config = await ApiService.getHallConfig(Number(seanceId), selectedDateStr);
        setHallConfig(config);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [seanceId]);

  const handleSeatClick = (rowIndex, placeIndex) => {
    if (!hallConfig || !seanceInfo?.hall) return;
    
    const seatType = hallConfig[rowIndex][placeIndex];
    const isSelected = selectedSeats.some(s => s.row === rowIndex + 1 && s.place === placeIndex + 1);

    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => !(s.row === rowIndex + 1 && s.place === placeIndex + 1)));
    } else {
      if (seatType === 'standart' || seatType === 'vip') {
        const cost = seatType === 'vip' ? seanceInfo.hall.hall_price_vip : seanceInfo.hall.hall_price_standart;
        const newSeat = { row: rowIndex + 1, place: placeIndex + 1, type: seatType, cost };
        setSelectedSeats(prev => [...prev, newSeat]);
      }
    }
  };
  
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + seat.cost, 0);
  }, [selectedSeats]);

  const handleBooking = () => {
    if (selectedSeats.length > 0 && seanceInfo) {
      navigate('/payment', { 
        state: { 
          ...seanceInfo, 
          selectedSeats, 
          totalPrice,
          date: selectedDateStr,
        }
      });
    }
  };
  
  if (loading) return <p className="text-white text-center">Загрузка схемы зала...</p>;
  if (error) return <p className="text-red-400 text-center">Ошибка: {error}</p>;
  if (!seanceInfo || !hallConfig) return <p className="text-white text-center">Информация о сеансе не найдена.</p>;

  const { film, hall, seance } = seanceInfo;

  return (
    <div className="hall-page">
      <main className="hall-main layout-990">
        <section className="hall-section">
        <div className="hall-info">
          <div className="hall-info-description">
            <h2 className="hall-film-title">{film?.film_name}</h2>
            <p className="hall-seance-time">Начало сеанса: {seance?.seance_time}</p>
            <p className="hall-name">{hall?.hall_name}</p>
          </div>
        </div>

          <div className="hall-scheme">
            <div className="hall-scheme-screen">
              <img src={`${import.meta.env.BASE_URL}images/screen.png`} alt="Экран" className="hall-scheme-screen-image" />
            </div>
            <div className="hall-scheme-wrapper">
              {hallConfig.map((row, rowIndex) => (
                <div key={rowIndex} className="hall-scheme-row">
                  {row.map((seatType, placeIndex) => {
                    const isSelected = selectedSeats.some(s => s.row === rowIndex + 1 && s.place === placeIndex + 1);
                    return (
                      <Seat
                        key={`${rowIndex}-${placeIndex}`}
                        type={seatType}
                        onClick={() => handleSeatClick(rowIndex, placeIndex)}
                        isSelected={isSelected}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="hall-legend">
            <div className="hall-legend-col hall-legend-col-left">
              <div className="hall-legend-item">
                <span className="hall-chair hall-chair-standart" />
                <span className="hall-legend-text">Свободно ({hall?.hall_price_standart}руб)</span>
              </div>
              <div className="hall-legend-item">
                <span className="hall-chair hall-chair-vip" />
                <span className="hall-legend-text">Свободно VIP ({hall?.hall_price_vip}руб)</span>
              </div>
            </div>
            <div className="hall-legend-col hall-legend-col-right">
              <div className="hall-legend-item">
                <span className="hall-chair hall-chair-taken" />
                <span className="hall-legend-text">Занято</span>
              </div>
              <div className="hall-legend-item">
                <span className="hall-chair hall-chair-selected" />
                <span className="hall-legend-text">Выбрано</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
            className="hall-booking-button"
          >
            Забронировать
          </button>
        </section>
      </main>
    </div>
  );
};

export default HallPage;
