import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

const getNextDays = (count, startOffset = 0) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = startOffset; i < startOffset + count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
};

const DayNavigator = ({ selectedDate, onDateChange, onNext, startOffset = 0 }) => {
  const days = getNextDays(6, startOffset);
  const todayStr = new Date().toDateString();

  return (
    <nav style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: '10px',
      width: '100%',
      height: '58px',
      boxSizing: 'border-box',
    }}>
      {days.map((day, index) => {
        const isSelected = selectedDate.toDateString() === day.toDateString();
        const isToday = day.toDateString() === todayStr;
        const isWeekend = day.getDay() === 6 || day.getDay() === 0;
        const dayName = day.toLocaleDateString('ru-RU', { weekday: 'short' });
        const textColor = isWeekend ? '#DE2121' : '#000000';
        const fontSize = isSelected ? '15px' : '12px';
        const fontWeight = isSelected ? 700 : 400;
        const lineHeight = isSelected ? '14px' : '14px';

        return (
          <div
            key={index}
            style={{
              flex: isSelected ? '2 1 0' : '1 1 0',
              marginLeft: index > 0 ? '1px' : '0',
              height: isSelected ? '52px' : '48px',
              minWidth: 0,
            }}
          >
            <button
              onClick={() => onDateChange(day)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isSelected ? '11px' : '10px',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif',
                background: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)',
                color: textColor,
                boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.12), 0px 2px 2px 0px rgba(0,0,0,0.24)',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              {isToday ? (
                <>
                  <span style={{ fontWeight, fontSize, lineHeight, color: textColor }}>
                    Сегодня
                  </span>
                  <span style={{ fontWeight, fontSize, lineHeight, color: textColor }}>
                    {dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {day.getDate()}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontWeight, fontSize, lineHeight, color: textColor }}>
                    {dayName.charAt(0).toUpperCase() + dayName.slice(1)},
                  </span>
                  <span style={{ fontWeight, fontSize, lineHeight, color: textColor }}>
                    {day.getDate()}
                  </span>
                </>
              )}
            </button>
          </div>
        );
      })}
      <div style={{
        flex: '1 1 0',
        marginLeft: '1px',
        height: '48px',
        minWidth: 0,
      }}>
        <button
          onClick={onNext}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            fontFamily: 'Consolas, monospace',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '28px',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#000000',
            boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.12), 0px 2px 2px 0px rgba(0,0,0,0.24)',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          &gt;
        </button>
      </div>
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
  const [dayOffset, setDayOffset] = useState(0);
  const { films, seances, halls, loading, error } = useData();

  const handleNext = () => setDayOffset(prev => prev + 6);

  return (
    <div className="main-wrap layout-990 flex flex-col">
      <DayNavigator
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onNext={handleNext}
        startOffset={dayOffset}
      />
      {loading && <p className="text-white text-center">Загрузка...</p>}
      {error && <p className="text-red-400 text-center">Ошибка: {error}</p>}
      {!loading && !error && films.map(film => (
        <MovieCard key={film.id} film={film} seances={seances} halls={halls} selectedDate={selectedDate} />
      ))}
    </div>
  );
};

export default MainPage;
