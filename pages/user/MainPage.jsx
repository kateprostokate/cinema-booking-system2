import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

const getNextDays = (count) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
};

const DayNavigator = ({ selectedDate, onDateChange }) => {
  const days = getNextDays(7);
  
  const formatDate = (date, type) => {
    if (type === 'full') {
      const isToday = new Date().toDateString() === date.toDateString();
      return isToday ? 'Сегодня' : date.toLocaleDateString('ru-RU', { weekday: 'short' });
    }
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  };

  return (
    <nav className="mb-8">
      <ul className="flex justify-start items-center gap-1">
        {days.map((day, index) => {
          const isSelected = selectedDate.toDateString() === day.toDateString();
          const isWeekend = day.getDay() === 6 || day.getDay() === 0;
          return (
            <li key={index} className={`flex-grow text-center basis-0`}>
              <button
                onClick={() => onDateChange(day)}
                className={`w-full p-2 text-sm md:text-base rounded-sm transition-all duration-300 transform ${
                  isSelected
                    ? 'bg-white text-black font-bold scale-105 shadow-lg z-10'
                    : 'bg-white/90 text-black shadow-md hover:bg-white'
                }`}
              >
                <span className={`block text-xs md:text-sm ${isWeekend && !isSelected ? 'text-red-500' : ''} ${isSelected && isWeekend ? 'text-red-500' : ''}`}>{formatDate(day, 'short')}, {day.getDate()}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const MovieCard = ({ film, seances, halls, selectedDate }) => {
  const seancesByHall = useMemo(() => {
    const grouped = {};
    const openHalls = halls.filter(h => h.hall_open === 1).map(h => h.id);
    const filmSeances = seances
      .filter(s => s.seance_filmid === film.id && openHalls.includes(s.seance_hallid))
      .sort((a, b) => a.seance_time.localeCompare(b.seance_time));
    
    for (const seance of filmSeances) {
      if (!grouped[seance.seance_hallid]) {
        grouped[seance.seance_hallid] = [];
      }
      grouped[seance.seance_hallid].push(seance);
    }
    return grouped;
  }, [film.id, seances, halls]);

  const getHallName = (hallId) => halls.find(h => h.id === hallId)?.hall_name || 'Неизвестный зал';
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString();
  const dateParam = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  if (Object.keys(seancesByHall).length === 0) {
    return null;
  }

  return (
    <section className="movie-section">
      <div className="movie-info">
        <div className="movie-poster">
          <img src={film.film_poster} alt={film.film_name} />
        </div>
        <div className="movie-description">
          <h3 className="movie-title">{film.film_name}</h3>
          <p className="movie-synopsis">{film.film_description}</p>
          <div className="movie-meta">
            <span>{film.film_duration} минут</span>
            <span>&nbsp;|&nbsp;</span>
            <span>{film.film_origin}</span>
          </div>
        </div>
      </div>
      <div className="hall-block">
        {Object.entries(seancesByHall).map(([hallId, hallSeances]) => (
          <div key={hallId}>
            <h4 className="hall-title">{getHallName(Number(hallId))}</h4>
            <div className="seances-row">
              {hallSeances.map(seance => {
                const isPast = isToday && seance.seance_time < currentTime;
                const to = `/hall/${seance.id}?date=${dateParam}`;
                return (
                  <Link key={seance.id} to={!isPast ? to : '#'} className={`seance-chip ${isPast ? 'disabled' : ''}`}>
                    {seance.seance_time}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const { films, seances, halls, loading, error } = useData();

  return (
    <div className="main-wrap layout-990 flex flex-col">
      <div className="page-nav">
        <DayNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>
      {loading && <p className="text-white text-center">Загрузка...</p>}
      {error && <p className="text-red-400 text-center">Ошибка: {error}</p>}
      {!loading && !error && films.map(film => (
        <MovieCard key={film.id} film={film} seances={seances} halls={halls} selectedDate={selectedDate} />
      ))}
    </div>
  );
};

export default MainPage;
