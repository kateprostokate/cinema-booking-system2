// FIX: Added useMemo to the react import to resolve 'Cannot find name useMemo' error.
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ApiService from '../../services/api';
import { useData } from '../../contexts/DataContext';

const AdminSection = ({ title, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  return (
    <div className="relative mb-px bg-[#EAE9EB]">
      <div className="hidden md:block absolute left-[61px] top-0 bottom-0 w-0.5 bg-[#BC95D6] z-0" style={{ left: 'calc(40px + 22px - 1px)' }}></div>
      <header
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-[#63536C] text-white py-6 md:py-8 pl-24 md:pl-32 pr-10 cursor-pointer flex justify-between items-center z-10"
      >
        <div className="absolute left-[40px] top-1/2 -translate-y-1/2 w-11 h-11 bg-white border-4 border-[#BC95D6] rounded-full"></div>
        <h2 className="text-lg md:text-2xl font-bold uppercase">{title}</h2>
        <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </header>
      {isOpen && (
        <div className="relative p-6 md:p-10 md:pl-32 z-10">
          {children}
        </div>
      )}
    </div>
  );
};

const HallsManagement = () => {
  const { halls, refreshData } = useData();
  const [newHallName, setNewHallName] = useState('');
  const [isCreateHallModalOpen, setCreateHallModalOpen] = useState(false);

  const handleCreateHall = async (e) => {
    e.preventDefault();
    if (!newHallName.trim()) return;
    const params = new FormData();
    params.set('hallName', newHallName);
    try {
      await ApiService.createHall(params);
      setNewHallName('');
      setCreateHallModalOpen(false);
      await refreshData();
    } catch (error) {
      console.error('Failed to create hall:', error);
      alert('Не удалось создать зал');
    }
  };
  
  const handleDeleteHall = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот зал? Все связанные сеансы также будут удалены.')) {
      try {
        await ApiService.deleteHall(id);
        await refreshData();
      } catch (error) {
        console.error('Failed to delete hall:', error);
        alert('Не удалось удалить зал');
      }
    }
  };

  return (
    <div className="w-full max-w-[390px] md:max-w-none bg-[#EAE9EB] bg-opacity-95 p-4 md:p-0">
      <p className="mb-4 font-normal text-base">Доступные залы:</p>
      <ul className="mb-6 space-y-2">
        {halls.map(hall => (
          <li key={hall.id} className="flex items-center gap-2">
            <span className="font-medium uppercase text-base">&ndash; {hall.hall_name}</span>
            <button onClick={() => handleDeleteHall(hall.id)} className="w-5 h-5 bg-white shadow-md rounded-sm flex items-center justify-center text-[#63536C] hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/>
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setCreateHallModalOpen(true)}
          className="bg-[#16A6AF] text-white px-8 py-3 rounded-[3px] shadow-md hover:bg-teal-600 transition-colors uppercase font-medium text-sm"
          style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.24), 0px 0px 3px rgba(0, 0, 0, 0.12)' }}
        >
          Создать зал
        </button>
      </div>

      {isCreateHallModalOpen && (
        <div
          className="popup_addhall fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] px-4"
        >
          <div
            className="popup__content flex flex-col items-center w-full max-w-[390px] md:max-w-[960px] md:w-[960px] relative"
            style={{ background: 'rgba(234, 233, 235, 0.95)' }}
          >
            <div className="popup__header flex flex-row justify-between items-center w-full px-4 md:px-[42px] py-4 bg-[#63536C]">
              <h3 className="popup__title font-bold text-[20px] md:text-[22px] leading-[25px] uppercase text-white m-auto">
                Добавление зала
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCreateHallModalOpen(false);
                  setNewHallName('');
                }}
                className="popup__close w-[22px] h-[22px] text-white text-2xl leading-none hover:opacity-80 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={handleCreateHall}
              className="popup__form flex flex-col items-center w-full gap-4 md:gap-[34px] pb-[35px] pt-[24px] md:pt-[34px] px-4"
            >
              <div className="popup__form-label-wrap flex flex-col items-start gap-[2px] w-full max-w-[370px] md:max-w-[750px]">
                <label className="popup__label font-normal text-xs leading-[14px] text-[#848484]">Название зала</label>
                <input
                  type="text"
                  value={newHallName}
                  onChange={e => setNewHallName(e.target.value)}
                  placeholder='Например, «Зал 1»'
                  required
                  className="popup__input w-full h-[35px] px-2 py-2 bg-white border border-[#B7B7B7] text-base text-gray-700 placeholder:text-[#757575]"
                  style={{ fontFamily: 'Roboto' }}
                />
              </div>
              <div className="conf-step__buttons flex flex-col md:flex-row justify-center items-stretch md:items-start gap-[14px] w-full max-w-[200px] md:max-w-none">
                <button
                  type="submit"
                  className="conf-step__button-primary flex justify-center items-center px-8 py-[11.2px] bg-[#16A6AF] text-white text-sm font-medium uppercase rounded-[3px] shadow-md hover:bg-[#148a92] transition-colors w-full md:w-auto"
                  style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.24), 0px 0px 3px rgba(0, 0, 0, 0.12)' }}
                >
                  Добавить зал
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateHallModalOpen(false);
                    setNewHallName('');
                  }}
                  className="conf-step__button-secondary flex justify-center items-center px-8 py-[11.2px] bg-white text-[#63536C] text-sm font-medium uppercase rounded-[3px] shadow-md hover:bg-gray-100 transition-colors w-full md:w-auto"
                  style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.24), 0px 0px 3px rgba(0, 0, 0, 0.12)' }}
                >
                  Отменить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const HallConfiguration = () => {
  const { halls, refreshData } = useData();
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [rows, setRows] = useState(10);
  const [places, setPlaces] = useState(8);
  const [config, setConfig] = useState([]);

  useEffect(() => {
    if (halls.length > 0 && !selectedHallId) {
      handleHallSelect(halls[0].id);
    }
  }, [halls, selectedHallId]);

  const handleHallSelect = (id) => {
    setSelectedHallId(id);
    const hall = halls.find(h => h.id === id);
    if (hall) {
      setRows(hall.hall_rows);
      setPlaces(hall.hall_places);
      setConfig(hall.hall_config.length > 0 ? hall.hall_config : Array(hall.hall_rows).fill(Array(hall.hall_places).fill('standart')));
    }
  };
  
  const handleGridSizeChange = (newRows, newPlaces) => {
    const r = Math.max(1, newRows);
    const p = Math.max(1, newPlaces);
    setRows(r);
    setPlaces(p);
    setConfig(Array(r).fill(null).map(() => Array(p).fill('standart')));
  };

  const handleSeatClick = (r, p) => {
    const newConfig = config.map(row => [...row]);
    const currentType = newConfig[r][p];
    const types = ['standart', 'vip', 'disabled'];
    const nextIndex = (types.indexOf(currentType) + 1) % types.length;
    newConfig[r][p] = types[nextIndex];
    setConfig(newConfig);
  };

  const handleSaveConfig = async () => {
    if (!selectedHallId) return;
    const params = new FormData();
    params.set('rowCount', String(rows));
    params.set('placeCount', String(places));
    params.set('config', JSON.stringify(config));
    try {
      await ApiService.updateHallConfig(selectedHallId, params);
      await refreshData();
      alert('Конфигурация зала сохранена');
    } catch (error) {
      console.error('Failed to save hall config:', error);
      alert('Ошибка сохранения');
    }
  };

  return (
    <div>
      <div className="mb-4">
        <p className="font-normal text-base">Выберите зал для конфигурации:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {halls.map(hall => (
            <button key={hall.id} onClick={() => handleHallSelect(hall.id)} className={`px-4 py-3 rounded-sm shadow-md transition-all text-sm uppercase font-medium ${selectedHallId === hall.id ? 'bg-white scale-105 font-bold' : 'bg-white/70 hover:bg-white/90'}`}>
              {hall.hall_name}
            </button>
          ))}
        </div>
      </div>
      {selectedHallId && (
        <div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 my-6 items-end">
            <div>
              <label className="font-normal text-xs text-gray-600 block mb-1">Рядов, шт</label>
              <input type="number" value={rows} onChange={e => handleGridSizeChange(Number(e.target.value), places)} className="w-24 p-2 border rounded border-gray-400" />
            </div>
            <span className="text-gray-500 text-xl pb-2">x</span>
            <div>
              <label className="font-normal text-xs text-gray-600 block mb-1">Мест, шт</label>
              <input type="number" value={places} onChange={e => handleGridSizeChange(rows, Number(e.target.value))} className="w-24 p-2 border rounded border-gray-400" />
            </div>
          </div>
          <p className="font-normal text-base mb-2">Теперь вы можете указать типы кресел на схеме зала:</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3 text-sm text-gray-700">
            <span className="flex items-center gap-2"><div className="w-5 h-5 rounded-sm border border-gray-700 bg-gray-400"></div>&mdash; обычные кресла</span>
            <span className="flex items-center gap-2"><div className="w-5 h-5 rounded-sm border border-teal-700 bg-[#B0D6D8]"></div>&mdash; VIP кресла</span>
            <span className="flex items-center gap-2"><div className="w-5 h-5 rounded-sm border border-gray-400"></div>&mdash; заблокированные (нет кресла)</span>
          </div>
          <p className="text-xs text-gray-600 mb-4">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
          <div className="border border-black p-4 md:p-8 inline-block">
            <div className="text-center text-black tracking-[19px] uppercase mb-6">Экран</div>
            {config.map((row, rIndex) => (
              <div key={rIndex} className="flex justify-center">
                {row.map((seat, pIndex) => {
                  let seatClass = '';
                  switch (seat) {
                    case 'standart': seatClass = 'bg-gray-400 border-gray-700'; break;
                    case 'vip': seatClass = 'bg-[#B0D6D8] border-teal-700'; break;
                    case 'disabled': seatClass = 'bg-transparent border-gray-400'; break;
                    default: break;
                  }
                  return (
                    <div
                      key={pIndex}
                      onClick={() => handleSeatClick(rIndex, pIndex)}
                      className={`w-5 h-5 sm:w-6 sm:h-6 m-1 rounded-sm cursor-pointer transition-colors border ${seatClass}`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
          <fieldset className="mt-6 flex justify-center gap-4">
            <button onClick={() => selectedHallId && handleHallSelect(selectedHallId)} className="bg-white text-[#63536C] px-6 py-2 rounded-sm shadow-md hover:bg-gray-100 uppercase font-medium">Отмена</button>
            <button onClick={handleSaveConfig} className="bg-[#16A6AF] text-white px-6 py-2 rounded-sm shadow-md hover:bg-teal-600 uppercase font-medium">Сохранить</button>
          </fieldset>
        </div>
      )}
    </div>
  );
};

const PriceConfiguration = () => {
  const { halls, refreshData } = useData();
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [priceStandart, setPriceStandart] = useState('');
  const [priceVip, setPriceVip] = useState('');
  
  useEffect(() => {
    if (halls.length > 0 && !selectedHallId) {
      handleHallSelect(halls[0].id);
    }
  }, [halls, selectedHallId]);
  
  const handleHallSelect = (id) => {
    setSelectedHallId(id);
    const hall = halls.find(h => h.id === id);
    if (hall) {
      setPriceStandart(String(hall.hall_price_standart));
      setPriceVip(String(hall.hall_price_vip));
    }
  };
  
  const handleSavePrice = async () => {
    if (!selectedHallId) return;
    const params = new FormData();
    params.set('priceStandart', priceStandart);
    params.set('priceVip', priceVip);
    try {
      await ApiService.updateHallPrice(selectedHallId, params);
      await refreshData();
      alert('Цены сохранены');
    } catch (error) {
      console.error('Failed to save prices:', error);
      alert('Ошибка сохранения цен');
    }
  };

  return (
    <div>
      <p className="font-normal text-base">Выберите зал для конфигурации:</p>
      <div className="flex flex-wrap gap-2 my-4">
        {halls.map(hall => (
          <button key={hall.id} onClick={() => handleHallSelect(hall.id)} className={`px-4 py-3 rounded-sm shadow-md transition-all text-sm uppercase font-medium ${selectedHallId === hall.id ? 'bg-white scale-105 font-bold' : 'bg-white/70 hover:bg-white/90'}`}>
            {hall.hall_name}
          </button>
        ))}
      </div>
      {selectedHallId && (
        <div className="mt-6 space-y-6">
          <div>
            <p className="font-normal text-base mb-2">Установите цены для типов кресел:</p>
            <div className="flex items-center">
              <label className="font-normal text-xs text-gray-600 block">Цена, рублей</label>
              <input type="number" value={priceStandart} onChange={e => setPriceStandart(e.target.value)} className="p-2 border rounded ml-2 w-24 border-gray-400" />
              <span className="ml-2 text-sm text-gray-700 flex items-center gap-2"> за <div className="w-5 h-5 rounded-sm border border-gray-700 bg-gray-400"></div> обычные кресла</span>
            </div>
          </div>
          <div className="flex items-center">
            <label className="font-normal text-xs text-gray-600 block">Цена, рублей</label>
            <input type="number" value={priceVip} onChange={e => setPriceVip(e.target.value)} className="p-2 border rounded ml-2 w-24 border-gray-400" />
            <span className="ml-2 text-sm text-gray-700 flex items-center gap-2"> за <div className="w-5 h-5 rounded-sm border border-teal-700 bg-[#B0D6D8]"></div> VIP кресла</span>
          </div>
          <fieldset className="mt-8 flex justify-center gap-4">
            <button onClick={() => selectedHallId && handleHallSelect(selectedHallId)} className="bg-white text-[#63536C] px-6 py-2 rounded-sm shadow-md hover:bg-gray-100 uppercase font-medium">Отмена</button>
            <button onClick={handleSavePrice} className="bg-[#16A6AF] text-white px-6 py-2 rounded-sm shadow-md hover:bg-teal-600 uppercase font-medium">Сохранить</button>
          </fieldset>
        </div>
      )}
    </div>
  );
};

const SeanceGrid = () => {
  const { films, halls, seances, refreshData } = useData();
  const [isAddFilmModalOpen, setAddFilmModalOpen] = useState(false);
  const [isAddSeanceModalOpen, setAddSeanceModalOpen] = useState(false);
  const [filmName, setFilmName] = useState('');
  const [filmDuration, setFilmDuration] = useState('');
  const [filmDescription, setFilmDescription] = useState('');
  const [filmOrigin, setFilmOrigin] = useState('');
  const [filmPoster, setFilmPoster] = useState(null);
  const [seanceHallId, setSeanceHallId] = useState('');
  const [seanceFilmId, setSeanceFilmId] = useState('');
  const [seanceTime, setSeanceTime] = useState('00:00');

  const draggedFilm = useRef(null);
  const draggedSeanceId = useRef(null);
  const dropSuccess = useRef(false);
  
  const filmColors = useMemo(() => {
    const colors = ['#85FF89', '#CAFF85', '#85FFD3', '#85E2FF', '#8599FF'];
    const colorMap = new Map();
    films.forEach((film, index) => {
      colorMap.set(film.id, colors[index % colors.length]);
    });
    return colorMap;
  }, [films]);

  const handleAddFilm = async (e) => {
    e.preventDefault();
    if (!filmPoster) {
      alert('Пожалуйста, загрузите постер');
      return;
    }
    const params = new FormData();
    params.set('filmName', filmName);
    params.set('filmDuration', filmDuration);
    params.set('filmDescription', filmDescription);
    params.set('filmOrigin', filmOrigin);
    params.set('filePoster', filmPoster);

    try {
      await ApiService.createFilm(params);
      await refreshData();
      setAddFilmModalOpen(false);
      setFilmName(''); setFilmDuration(''); setFilmDescription(''); setFilmOrigin(''); setFilmPoster(null);
    } catch (error) {
      console.error('Failed to add film:', error);
      alert('Не удалось добавить фильм');
    }
  };
  
  const handleDeleteFilm = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот фильм? Все связанные сеансы также будут удалены.')) {
      try {
        await ApiService.deleteFilm(id);
        await refreshData();
      } catch (error) {
        console.error('Failed to delete film:', error);
        alert('Не удалось удалить фильм');
      }
    }
  };
  
  const handleAddSeance = async (e) => {
    e.preventDefault();
    if (!seanceHallId || !seanceFilmId || !seanceTime) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    const params = new FormData();
    params.set('seanceHallid', seanceHallId);
    params.set('seanceFilmid', seanceFilmId);
    params.set('seanceTime', seanceTime);
    try {
      await ApiService.createSeance(params);
      await refreshData();
      setAddSeanceModalOpen(false);
      setSeanceHallId(''); setSeanceFilmId(''); setSeanceTime('00:00');
    } catch (error) {
      console.error('Failed to add seance:', error);
      alert('Не удалось добавить сеанс');
    }
  };
  
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleDrop = async (e, hallId) => {
    e.preventDefault();
    if (!draggedFilm.current) return;
    
    dropSuccess.current = true;
    const film = draggedFilm.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const totalMinutes = 24 * 60;
    const startTimeInMinutes = Math.round((dropX / rect.width) * totalMinutes);

    const hallSeances = seances.filter(s => s.seance_hallid === hallId);
    const newSeanceStart = startTimeInMinutes;
    const newSeanceEnd = newSeanceStart + film.film_duration;

    const isOverlap = hallSeances.some(seance => {
      const existingFilm = films.find(f => f.id === seance.seance_filmid);
      if (!existingFilm) return false;
      const existingStart = timeToMinutes(seance.seance_time);
      const existingEnd = existingStart + existingFilm.film_duration;
      return newSeanceStart < existingEnd && newSeanceEnd > existingStart;
    });

    if (isOverlap) {
      alert('Ошибка: сеанс пересекается с существующим.');
      return;
    }

    const hours = String(Math.floor(startTimeInMinutes / 60)).padStart(2, '0');
    const minutes = String(startTimeInMinutes % 60).padStart(2, '0');
    const seanceTime = `${hours}:${minutes}`;

    const params = new FormData();
    params.set('seanceHallid', String(hallId));
    params.set('seanceFilmid', String(film.id));
    params.set('seanceTime', seanceTime);
    
    try {
      await ApiService.createSeance(params);
      await refreshData();
    } catch (error) {
      console.error('Failed to add seance:', error);
      alert('Не удалось добавить сеанс.');
    }
  };

  const handleSeanceDragEnd = async () => {
    if (draggedSeanceId.current && !dropSuccess.current) {
      if (window.confirm('Удалить сеанс?')) {
        try {
          await ApiService.deleteSeance(draggedSeanceId.current);
          await refreshData();
        } catch (e) {
          alert('Ошибка удаления сеанса');
        }
      }
    }
    draggedSeanceId.current = null;
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setAddFilmModalOpen(true)} className="bg-[#16A6AF] text-white px-6 py-2 rounded-sm shadow-md hover:bg-teal-600 transition-colors uppercase font-medium">
          Добавить фильм
        </button>
        <button onClick={() => setAddSeanceModalOpen(true)} className="bg-[#16A6AF] text-white px-6 py-2 rounded-sm shadow-md hover:bg-teal-600 transition-colors uppercase font-medium">
          Добавить сеанс
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        {films.map(film => (
          <div
            key={film.id}
            draggable
            onDragStart={() => { draggedFilm.current = film; dropSuccess.current = false; }}
            onDragEnd={() => { draggedFilm.current = null; }}
            className="p-2 rounded cursor-grab flex items-center gap-2 shadow-md border border-black/30 w-full sm:w-auto"
            style={{ backgroundColor: filmColors.get(film.id) || '#E0E0E0' }}
          >
            <img src={film.film_poster} alt={film.film_name} className="w-10 h-14 object-cover" />
            <div className="flex-grow pr-6 relative">
              <p className="font-semibold text-sm">{film.film_name}</p>
              <p className="text-xs text-black/70">{film.film_duration} минут</p>
              <button onClick={() => handleDeleteFilm(film.id)} className="absolute top-1/2 -right-1 -translate-y-1/2 text-[#63536C] hover:text-gray-700 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {halls.map(hall => (
          <div key={hall.id}>
            <h3 className="font-medium uppercase text-base">{hall.hall_name}</h3>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, hall.id)}
              className="bg-gray-50 border border-gray-500 mt-2 h-20 relative"
            >
              {seances.filter(s => s.seance_hallid === hall.id).map(seance => {
                const film = films.find(f => f.id === seance.seance_filmid);
                if (!film) return null;
                const left = (timeToMinutes(seance.seance_time) / (24 * 60)) * 100;
                const width = (film.film_duration / (24 * 60)) * 100;
                return (
                  <div
                    key={seance.id}
                    draggable
                    onDragStart={() => { draggedSeanceId.current = seance.id; dropSuccess.current = false; }}
                    onDragEnd={handleSeanceDragEnd}
                    onDrop={(e) => { e.stopPropagation(); dropSuccess.current = true; }}
                    className="absolute text-black text-xs p-1 rounded overflow-hidden whitespace-nowrap cursor-move shadow-lg border border-black/30"
                    style={{ left: `${left}%`, width: `${width}%`, top: '0.5rem', bottom: '0.5rem', backgroundColor: filmColors.get(film.id) || '#E0E0E0' }}
                    title={`${film.film_name}, ${seance.seance_time}`}
                  >
                    <p className="text-[10px] leading-tight font-medium">{film.film_name}</p>
                    <p className="text-[9px]">{seance.seance_time}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {isAddFilmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[9999]" style={{ position: 'fixed', paddingTop: '120px' }}>
          <div className="flex flex-col items-center w-[960px] relative" style={{ background: 'rgba(234, 233, 235, 0.95)' }}>
            <div className="flex flex-row justify-between items-center w-full px-[42px] py-4 bg-[#63536C]">
              <h3 className="font-bold text-[22px] leading-[25px] uppercase text-white m-auto">Добавление фильма</h3>
              <button type="button" onClick={() => setAddFilmModalOpen(false)} className="w-[22px] h-[22px] text-white text-2xl leading-none hover:opacity-80">&times;</button>
            </div>
            <form onSubmit={handleAddFilm} className="flex flex-col items-center w-full gap-[34px] pb-[35px] pt-[34px]">
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex flex-col items-start gap-[2px] w-[750px]">
                  <label className="font-normal text-xs leading-[14px] text-[#848484]">Название фильма</label>
                  <input
                    type="text"
                    value={filmName}
                    onChange={e => setFilmName(e.target.value)}
                    placeholder='Например, «Гражданин Кейн»'
                    required
                    className="w-full h-[35px] px-2 py-2 bg-white border border-[#B7B7B7] text-base text-gray-700 placeholder:text-[#757575]"
                    style={{ fontFamily: 'Roboto' }}
                  />
                </div>
                <div className="flex flex-col items-start gap-[2px] w-[750px]">
                  <label className="font-normal text-xs leading-[14px] text-[#848484]">Продолжительность фильма (мин.)</label>
                  <input
                    type="number"
                    value={filmDuration}
                    onChange={e => setFilmDuration(e.target.value)}
                    required
                    className="w-full h-[36px] px-2 py-2 bg-white border border-[#B7B7B7] text-base text-gray-700"
                    style={{ fontFamily: 'Roboto' }}
                  />
                </div>
                <div className="flex flex-col items-start gap-[2px] w-[750px]">
                  <label className="font-normal text-xs leading-[14px] text-[#848484]">Описание фильма</label>
                  <textarea
                    value={filmDescription}
                    onChange={e => setFilmDescription(e.target.value)}
                    required
                    className="w-[750px] min-w-[750px] max-w-[750px] h-[80px] min-h-[80px] max-h-[80px] px-2 py-2 bg-white border border-[#B7B7B7] text-base text-gray-700 resize-none"
                    style={{ fontFamily: 'Roboto' }}
                  />
                </div>
                <div className="flex flex-col items-start gap-[2px] w-[750px]">
                  <label className="font-normal text-xs leading-[14px] text-[#848484]">Страна</label>
                  <input
                    type="text"
                    value={filmOrigin}
                    onChange={e => setFilmOrigin(e.target.value)}
                    required
                    className="w-full h-[36px] px-2 py-2 bg-white border border-[#B7B7B7] text-base text-gray-700"
                    style={{ fontFamily: 'Roboto' }}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-center items-start gap-[14px]">
                <button type="submit" className="flex justify-center items-center px-8 py-[11.2px] bg-[#16A6AF] text-white text-sm font-medium uppercase rounded-[3px] shadow-md hover:bg-[#148a92] transition-colors" style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.24), 0px 0px 3px rgba(0, 0, 0, 0.12)' }}>
                  Добавить фильм
                </button>
                <label className="flex justify-center items-center px-8 py-[11.2px] bg-[#16A6AF] text-white text-sm font-medium uppercase rounded-[3px] shadow-md hover:bg-[#148a92] transition-colors cursor-pointer" style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.24), 0px 0px 3px rgba(0, 0, 0, 0.12)' }}>
                  Загрузить постер
                  <input type="file" onChange={e => setFilmPoster(e.target.files ? e.target.files[0] : null)} required accept="image/png" className="hidden" />
                </label>
                <button type="button" onClick={() => setAddFilmModalOpen(false)} className="flex justify-center items-center px-8 py-[11.2px] bg-white text-[#63536C] text-sm font-medium uppercase rounded-[3px] shadow-md hover:bg-gray-100 transition-colors" style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.24), 0px 0px 3px rgba(0, 0, 0, 0.12)' }}>
                  Отменить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddSeanceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[9999]" style={{ position: 'fixed', paddingTop: '120px' }}>
          <div className="flex flex-col items-center w-[960px] relative" style={{ background: 'rgba(234, 233, 235, 0.95)' }}>
            <div className="flex flex-row justify-between items-center w-full px-[42px] py-4 bg-[#63536C]">
              <h3 className="font-bold text-[22px] leading-[25px] uppercase text-white m-auto">Добавление сеанса</h3>
              <button type="button" onClick={() => setAddSeanceModalOpen(false)} className="w-[22px] h-[22px] text-white text-2xl leading-none hover:opacity-80">&times;</button>
            </div>
            <form onSubmit={handleAddSeance} className="flex flex-col items-center w-full gap-[34px] pb-[35px] pt-[34px]">
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex flex-col items-start gap-[2px] w-[750px]">
                  <label className="font-normal text-xs leading-[14px] text-[#848484]">Название зала</label>
                  <select
                    value={seanceHallId}
                    onChange={e => setSeanceHallId(e.target.value)}
                    required
                    className="w-full h-[36px] px-3 py-2 bg-white border border-[#B7B7B7] text-base text-gray-700"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    <option value="">Название зала</option>
                    {halls.map(hall => (
                      <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col items-start gap-[2px] w-[750px]">
                  <label className="font-normal text-xs leading-[14px] text-[#848484]">Название фильма</label>
                  <select
                    value={seanceFilmId}
                    onChange={e => setSeanceFilmId(e.target.value)}
                    required
                    className="w-full h-[36px] px-3 py-2 bg-white border border-[#B7B7B7] text-base text-gray-700"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    <option value="">Название фильма</option>
                    {films.map(film => (
                      <option key={film.id} value={film.id}>{film.film_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col items-start gap-[2px] w-[750px]">
                  <label className="font-normal text-xs leading-[14px] text-[#848484]">Время начала</label>
                  <input
                    type="time"
                    value={seanceTime}
                    onChange={e => setSeanceTime(e.target.value)}
                    required
                    className="w-full h-[36px] px-3 py-2 bg-white border border-[#B7B7B7] text-base text-gray-700"
                    style={{ fontFamily: 'Roboto' }}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-center items-start gap-[14px]">
                <button type="submit" className="flex justify-center items-center px-8 py-[11.2px] bg-[#16A6AF] text-white text-sm font-medium uppercase rounded-[3px] shadow-md hover:bg-[#148a92] transition-colors" style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.24), 0px 0px 3px rgba(0, 0, 0, 0.12)' }}>
                  Добавить сеанс
                </button>
                <button type="button" onClick={() => setAddSeanceModalOpen(false)} className="flex justify-center items-center px-8 py-[11.2px] bg-white text-[#63536C] text-sm font-medium uppercase rounded-[3px] shadow-md hover:bg-gray-100 transition-colors" style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.24), 0px 0px 3px rgba(0, 0, 0, 0.12)' }}>
                  Отменить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SalesManagement = () => {
  const { halls, refreshData } = useData();
  const [selectedHallId, setSelectedHallId] = useState(null);

  useEffect(() => {
    if (halls.length > 0 && !selectedHallId) {
      setSelectedHallId(halls[0].id);
    }
  }, [halls, selectedHallId]);

  const toggleSales = async (hallId) => {
    const hall = halls.find(h => h.id === hallId);
    if (!hall) return;
    
    const params = new FormData();
    params.set('hallOpen', hall.hall_open === 1 ? '0' : '1');
    try {
      await ApiService.updateHallOpen(hall.id, params);
      await refreshData();
    } catch (error) {
      console.error('Failed to toggle sales:', error);
      alert('Ошибка изменения статуса продаж');
    }
  };
  
  const selectedHall = halls.find(h => h.id === selectedHallId);

  return (
    <div>
      <p className="font-normal text-base">Выберите зал для открытия/закрытия продаж:</p>
      <div className="flex flex-wrap gap-2 my-4">
        {halls.map(hall => (
          <button key={hall.id} onClick={() => setSelectedHallId(hall.id)} className={`px-4 py-3 rounded-sm shadow-md transition-all text-sm uppercase font-medium ${selectedHallId === hall.id ? 'bg-white scale-105 font-bold' : 'bg-white/70 hover:bg-white/90'}`}>
            {hall.hall_name}
          </button>
        ))}
      </div>
      
      {selectedHall && (
        <div className="text-center mt-8">
          <p className="font-normal text-base mb-4">Всё готово к открытию</p>
          <button onClick={() => toggleSales(selectedHall.id)} className={`px-6 py-2 rounded-sm shadow-md text-white w-full sm:w-auto transition-colors uppercase font-medium ${selectedHall.hall_open === 1 ? 'bg-red-500 hover:bg-red-600' : 'bg-[#16A6AF] hover:bg-teal-600'}`}>
            {selectedHall.hall_open === 1 ? 'Приостановить продажу билетов' : 'Открыть продажу билетов'}
          </button>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <AdminSection title="Управление залами" initiallyOpen={true}>
        <HallsManagement />
      </AdminSection>
      <AdminSection title="Конфигурация залов">
        <HallConfiguration />
      </AdminSection>
      <AdminSection title="Конфигурация цен">
        <PriceConfiguration />
      </AdminSection>
      <AdminSection title="Сетка сеансов">
        <SeanceGrid />
      </AdminSection>
      <AdminSection title="Открыть продажи">
        <SalesManagement />
      </AdminSection>
    </div>
  );
};

export default AdminDashboard;
