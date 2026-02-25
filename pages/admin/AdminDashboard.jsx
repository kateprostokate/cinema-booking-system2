import React, { useState, useRef, useEffect, useMemo } from 'react';
import ApiService from '../../services/api';
import { useData } from '../../contexts/DataContext';

const sectionShadow = '0px 0px 3px 0px rgba(0,0,0,0.12), 0px 3px 3px 0px rgba(0,0,0,0.24)';
const activeTabShadow = '0px 0px 2px 0px rgba(0,0,0,0.12), 0px 2px 2px 0px rgba(0,0,0,0.24), 0px 6px 8px 0px rgba(0,0,0,0.24)';
const assetBase = import.meta.env.BASE_URL;

const HallTab = ({ hall, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: isActive ? '90px' : '81px',
      height: isActive ? '46px' : '42px',
      background: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
      borderRadius: '3px',
      border: 'none',
      boxShadow: isActive ? activeTabShadow : sectionShadow,
      cursor: 'pointer',
      fontFamily: 'Roboto, sans-serif',
      fontWeight: isActive ? 900 : 500,
      fontSize: isActive ? '15px' : '14px',
      lineHeight: isActive ? '1.067em' : '1.143em',
      textTransform: 'uppercase',
      color: '#000000',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
    }}
  >
    {hall.hall_name}
  </button>
);

const ButtonPrimary = ({ children, onClick, type = 'button', style }) => (
  <button
    type={type}
    onClick={onClick}
    style={{
      height: '40px',
      padding: '11px 32px 12px',
      background: '#16A6AF',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '3px',
      boxShadow: sectionShadow,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '1.143em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      ...style,
    }}
  >
    {children}
  </button>
);

const ButtonSecondary = ({ children, onClick, type = 'button', style }) => (
  <button
    type={type}
    onClick={onClick}
    style={{
      width: '121px',
      height: '40px',
      padding: '11px 31px 12px',
      background: '#FFFFFF',
      color: '#63536C',
      border: 'none',
      borderRadius: '3px',
      boxShadow: sectionShadow,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '1.143em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      ...style,
    }}
  >
    {children}
  </button>
);

const ChairIcon = ({ type, size = 26, onClick, style }) => {
  const styles = {
    standart: { background: '#C4C4C4', border: '1px solid #393939' },
    vip: { background: '#B0D6D8', border: '1px solid #0A828A' },
    disabled: { background: 'transparent', border: '1px solid #C4C4C4' },
  };
  return (
    <div
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '4px',
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        ...(styles[type] || styles.standart),
        ...style,
      }}
    />
  );
};

const AdminSection = ({ title, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  return (
    <div style={{ position: 'relative', marginBottom: '1px', background: 'rgba(234, 233, 235, 0.95)' }}>
      <div style={{
        position: 'absolute',
        left: '61px',
        top: 0,
        bottom: 0,
        width: '2px',
        background: '#BC95D6',
        zIndex: -1,
      }} />
      <header
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: '#63536C',
          color: '#FFFFFF',
          padding: '35px 42px 35px 104px',
          height: '95px',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{
          position: 'absolute',
          left: '61px',
          top: '48px',
          width: '2px',
          height: '48px',
          background: '#BC95D6',
        }} />
        <div style={{
          position: 'absolute',
          left: '40px',
          top: '26px',
          width: '44px',
          height: '44px',
          background: '#FFFFFF',
          border: '4px solid #BC95D6',
          borderRadius: '50%',
          boxSizing: 'border-box',
        }} />
        <h2 style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '22px',
          lineHeight: '25px',
          textTransform: 'uppercase',
          margin: 0,
        }}>{title}</h2>
        <img
          src={`${assetBase}images/chevron.svg`}
          alt=""
          width="24"
          height="16"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </header>
      {isOpen && (
        <div style={{
          position: 'relative',
          padding: '35px 42px 24px 104px',
        }}>
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
    <div>
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '18px',
        color: '#000000',
        margin: '0 0 12px 0',
      }}>Доступные залы:</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {halls.map(hall => (
          <li key={hall.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '18px',
              textTransform: 'uppercase',
              color: '#000000',
            }}>– {hall.hall_name} </span>
            <button
              onClick={() => handleDeleteHall(hall.id)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <img src={`${assetBase}images/delete-hall.svg`} alt="Удалить" width="20" height="20" />
            </button>
          </li>
        ))}
      </ul>
      <ButtonPrimary onClick={() => setCreateHallModalOpen(true)} style={{ width: '159px' }}>
        Создать зал
      </ButtonPrimary>

      {isCreateHallModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '0 16px',
          }}
        >
          <div style={{ background: 'rgba(234, 233, 235, 0.95)', width: '960px', maxWidth: '100%' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 42px',
              height: '95px',
              background: '#63536C',
            }}>
              <h3 style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '25px',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: '0 auto',
              }}>Добавление зала</h3>
              <button
                type="button"
                onClick={() => { setCreateHallModalOpen(false); setNewHallName(''); }}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}
              >&times;</button>
            </div>
            <form
              onSubmit={handleCreateHall}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '34px', padding: '34px 16px 35px' }}
            >
              <div style={{ width: '100%', maxWidth: '750px' }}>
                <label style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#848484',
                  display: 'block',
                  marginBottom: '2px',
                }}>Название зала</label>
                <input
                  type="text"
                  value={newHallName}
                  onChange={e => setNewHallName(e.target.value)}
                  placeholder='Например, «Зал 1»'
                  required
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '8px 9px',
                    background: '#FFFFFF',
                    border: '1px solid #B7B7B7',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '16px',
                    color: '#000000',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <ButtonPrimary type="submit">Добавить зал</ButtonPrimary>
                <ButtonSecondary onClick={() => { setCreateHallModalOpen(false); setNewHallName(''); }}>
                  Отменить
                </ButtonSecondary>
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

  const labelStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '14px',
    color: '#848484',
    display: 'block',
    marginBottom: '2px',
  };

  const inputStyle = {
    width: '100px',
    height: '36px',
    padding: '8px 9px',
    background: '#FFFFFF',
    border: '1px solid #B7B7B7',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    color: '#000000',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '18px',
        color: '#000000',
        margin: '0 0 12px 0',
      }}>Выберите зал для конфигурации:</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '24px' }}>
        {halls.map(hall => (
          <HallTab key={hall.id} hall={hall} isActive={selectedHallId === hall.id} onClick={() => handleHallSelect(hall.id)} />
        ))}
      </div>
      {selectedHallId && (
        <div>
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '18px',
            color: '#000000',
            margin: '0 0 12px 0',
          }}>Укажите количество рядов и максимальное количество кресел в ряду:</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0', marginBottom: '24px', position: 'relative' }}>
            <div>
              <label style={labelStyle}>Рядов, шт</label>
              <input
                type="number"
                value={rows}
                onChange={e => handleGridSizeChange(Number(e.target.value), places)}
                style={inputStyle}
              />
            </div>
            <span style={{
              fontFamily: 'Consolas, monospace',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '21px',
              color: '#848484',
              padding: '0 7px',
              marginBottom: '8px',
            }}>x</span>
            <div>
              <label style={labelStyle}>Мест, шт</label>
              <input
                type="number"
                value={places}
                onChange={e => handleGridSizeChange(rows, Number(e.target.value))}
                style={inputStyle}
              />
            </div>
          </div>

          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '18px',
            color: '#000000',
            margin: '0 0 12px 0',
          }}>Теперь вы можете указать типы кресел на схеме зала:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '23px', marginBottom: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <ChairIcon type="standart" />
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#848484' }}> — обычные кресла </span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <ChairIcon type="vip" />
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#848484' }}> — VIP кресла </span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <ChairIcon type="disabled" />
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#848484' }}> — заблокированные (нет кресла)</span>
            </span>
          </div>
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '16px',
            color: '#848484',
            margin: '0 0 16px 0',
          }}>Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>

          <div style={{ border: '1px solid #000000', padding: '64px 0 36px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '18px',
                letterSpacing: '19px',
                textTransform: 'uppercase',
                color: '#000000',
                textAlign: 'center',
                marginBottom: '20px',
              }}>экран</div>
              {config.map((row, rIndex) => (
                <div key={rIndex} style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                  {row.map((seat, pIndex) => (
                    <ChairIcon
                      key={pIndex}
                      type={seat}
                      onClick={() => handleSeatClick(rIndex, pIndex)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '17px' }}>
            <ButtonSecondary onClick={() => selectedHallId && handleHallSelect(selectedHallId)}>Отмена</ButtonSecondary>
            <ButtonPrimary onClick={handleSaveConfig}>Сохранить</ButtonPrimary>
          </div>
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

  const labelStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '14px',
    color: '#848484',
    display: 'block',
    marginBottom: '2px',
  };

  const inputStyle = {
    width: '100px',
    height: '36px',
    padding: '8px 9px',
    background: '#FFFFFF',
    border: '1px solid #B7B7B7',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    color: '#000000',
    boxSizing: 'border-box',
  };

  const helperText = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#848484',
  };

  return (
    <div>
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '18px',
        color: '#000000',
        margin: '0 0 12px 0',
      }}>Выберите зал для конфигурации:</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '24px' }}>
        {halls.map(hall => (
          <HallTab key={hall.id} hall={hall} isActive={selectedHallId === hall.id} onClick={() => handleHallSelect(hall.id)} />
        ))}
      </div>
      {selectedHallId && (
        <div>
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '18px',
            color: '#000000',
            margin: '0 0 12px 0',
          }}>Установите цены для типов кресел:</p>

          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Цена, рублей</label>
              <input type="number" value={priceStandart} onChange={e => setPriceStandart(e.target.value)} style={inputStyle} />
            </div>
            <span style={{ ...helperText, padding: '0 6px', marginBottom: '10px' }}> за </span>
            <ChairIcon type="standart" style={{ marginBottom: '6px' }} />
            <span style={{ ...helperText, marginBottom: '10px', marginLeft: '2px' }}> обычные кресла</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Цена, рублей</label>
              <input type="number" value={priceVip} onChange={e => setPriceVip(e.target.value)} style={inputStyle} />
            </div>
            <span style={{ ...helperText, padding: '0 6px', marginBottom: '10px' }}> за </span>
            <ChairIcon type="vip" style={{ marginBottom: '6px' }} />
            <span style={{ ...helperText, marginBottom: '10px', marginLeft: '2px' }}> VIP кресла</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '17px' }}>
            <ButtonSecondary onClick={() => selectedHallId && handleHallSelect(selectedHallId)}>Отмена</ButtonSecondary>
            <ButtonPrimary onClick={handleSavePrice}>Сохранить</ButtonPrimary>
          </div>
        </div>
      )}
    </div>
  );
};

const SeanceGrid = () => {
  const { films, halls, seances, refreshData } = useData();
  const [isAddFilmModalOpen, setAddFilmModalOpen] = useState(false);
  const [filmName, setFilmName] = useState('');
  const [filmDuration, setFilmDuration] = useState('');
  const [filmDescription, setFilmDescription] = useState('');
  const [filmOrigin, setFilmOrigin] = useState('');
  const [filmPoster, setFilmPoster] = useState(null);

  const [pendingSeance, setPendingSeance] = useState(null);
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

  const handleConfirmSeance = async (e) => {
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
      closePendingSeance();
    } catch (error) {
      console.error('Failed to add seance:', error);
      alert('Не удалось добавить сеанс');
    }
  };

  const closePendingSeance = () => {
    setPendingSeance(null);
    setSeanceHallId('');
    setSeanceFilmId('');
    setSeanceTime('00:00');
  };
  
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleDrop = (e, hallId) => {
    e.preventDefault();
    if (!draggedFilm.current) return;
    
    dropSuccess.current = true;
    const film = draggedFilm.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const totalMinutes = 24 * 60;
    const startTimeInMinutes = Math.round((dropX / rect.width) * totalMinutes);

    const hours = String(Math.floor(startTimeInMinutes / 60)).padStart(2, '0');
    const minutes = String(startTimeInMinutes % 60).padStart(2, '0');
    const calcTime = `${hours}:${minutes}`;

    setSeanceHallId(String(hallId));
    setSeanceFilmId(String(film.id));
    setSeanceTime(calcTime);
    setPendingSeance({ hallId, filmId: film.id, time: calcTime });
  };

  const handleSeanceDragEnd = async () => {
    if (draggedSeanceId.current && !dropSuccess.current) {
      try {
        await ApiService.deleteSeance(draggedSeanceId.current);
        await refreshData();
      } catch (e) {
        alert('Ошибка удаления сеанса');
      }
    }
    draggedSeanceId.current = null;
  };

  const modalLabelStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '14px',
    color: '#848484',
    display: 'block',
    marginBottom: '2px',
  };

  const modalInputStyle = {
    width: '100%',
    height: '36px',
    padding: '8px 12px',
    background: '#FFFFFF',
    border: '1px solid #B7B7B7',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    lineHeight: '1.2em',
    color: '#000000',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <ButtonPrimary onClick={() => setAddFilmModalOpen(true)}>
          Добавить фильм
        </ButtonPrimary>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
        {films.map(film => (
          <div
            key={film.id}
            draggable
            onDragStart={() => { draggedFilm.current = film; dropSuccess.current = false; }}
            onDragEnd={() => { draggedFilm.current = null; }}
            style={{
              display: 'flex',
              width: '259px',
              backgroundColor: filmColors.get(film.id) || '#E0E0E0',
              border: '1px solid rgba(0,0,0,0.3)',
              cursor: 'grab',
              position: 'relative',
            }}
          >
            <img
              src={film.film_poster}
              alt={film.film_name}
              style={{ width: '38px', height: '50px', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, padding: '0 10px', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center', flex: 1 }}>
                <span style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '1.143em',
                  color: '#000000',
                }}>{film.film_name}</span>
                <span style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: 'rgba(0,0,0,0.7)',
                }}>{film.film_duration} минут</span>
              </div>
            </div>
            <button
              onClick={() => handleDeleteFilm(film.id)}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={`${assetBase}images/delete-film.svg`} alt="Удалить" width="20" height="20" />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', padding: '0 35px' }}>
        {halls.map(hall => (
          <div key={hall.id}>
            <h3 style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '18px',
              textTransform: 'uppercase',
              color: '#000000',
              margin: '0 0 0 0',
            }}>{hall.hall_name}</h3>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, hall.id)}
              style={{
                border: '1px solid #848484',
                height: '60px',
                position: 'relative',
                marginTop: '0',
              }}
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
                    style={{
                      position: 'absolute',
                      left: `${left}%`,
                      width: `${width}%`,
                      top: '10px',
                      height: '40px',
                      backgroundColor: filmColors.get(film.id) || '#E0E0E0',
                      border: '1px solid rgba(0,0,0,0.3)',
                      padding: '10px',
                      boxSizing: 'border-box',
                      cursor: 'move',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    title={`${film.film_name}, ${seance.seance_time}`}
                  >
                    <span style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '10px',
                      color: '#000000',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{film.film_name}</span>
                    <div style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '-5px',
                      width: '1px',
                      height: '5px',
                      background: '#848484',
                    }} />
                    <span style={{
                      position: 'absolute',
                      left: '-13px',
                      bottom: '-18px',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '14px',
                      color: '#848484',
                      width: '30px',
                      textAlign: 'center',
                    }}>{seance.seance_time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '17px' }}>
        <ButtonSecondary onClick={() => {}}>Отмена</ButtonSecondary>
        <ButtonPrimary onClick={() => {}}>Сохранить</ButtonPrimary>
      </div>

      {isAddFilmModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 9999,
          paddingTop: '120px',
        }}>
          <div style={{ background: 'rgba(234, 233, 235, 0.95)', width: '960px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 42px',
              height: '95px',
              background: '#63536C',
            }}>
              <h3 style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '25px',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: '0 auto',
              }}>Добавление фильма</h3>
              <button
                type="button"
                onClick={() => setAddFilmModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}
              >&times;</button>
            </div>
            <form onSubmit={handleAddFilm} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '34px', padding: '34px 16px 35px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '750px' }}>
                <div>
                  <label style={modalLabelStyle}>Название фильма</label>
                  <input type="text" value={filmName} onChange={e => setFilmName(e.target.value)} placeholder='Например, «Гражданин Кейн»' required style={modalInputStyle} />
                </div>
                <div>
                  <label style={modalLabelStyle}>Продолжительность фильма (мин.)</label>
                  <input type="number" value={filmDuration} onChange={e => setFilmDuration(e.target.value)} required style={modalInputStyle} />
                </div>
                <div>
                  <label style={modalLabelStyle}>Описание фильма</label>
                  <textarea
                    value={filmDescription}
                    onChange={e => setFilmDescription(e.target.value)}
                    required
                    style={{
                      ...modalInputStyle,
                      height: '80px',
                      resize: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={modalLabelStyle}>Страна</label>
                  <input type="text" value={filmOrigin} onChange={e => setFilmOrigin(e.target.value)} required style={modalInputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <ButtonPrimary type="submit">Добавить фильм</ButtonPrimary>
                <label style={{
                  height: '40px',
                  padding: '11px 32px 12px',
                  background: '#16A6AF',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '3px',
                  boxShadow: sectionShadow,
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '1.143em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}>
                  Загрузить постер
                  <input type="file" onChange={e => setFilmPoster(e.target.files ? e.target.files[0] : null)} required accept="image/png" style={{ display: 'none' }} />
                </label>
                <ButtonSecondary onClick={() => setAddFilmModalOpen(false)} style={{ width: 'auto', padding: '11px 32px 12px' }}>
                  Отменить
                </ButtonSecondary>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingSeance && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 9999,
          paddingTop: '120px',
        }}>
          <div style={{ background: 'rgba(234, 233, 235, 0.95)', width: '960px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 42px 14px',
              height: '57px',
              boxSizing: 'border-box',
              background: '#63536C',
            }}>
              <h3 style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '25px',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: 0,
              }}>Добавление сеанса</h3>
              <button
                type="button"
                onClick={closePendingSeance}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                }}
              >
                <img src={`${assetBase}images/close.png`} alt="Закрыть" width="22" height="22" />
              </button>
            </div>
            <form onSubmit={handleConfirmSeance} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '34px', padding: '24px 16px 35px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '752px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <label style={modalLabelStyle}>Название зала</label>
                  <select value={seanceHallId} onChange={e => setSeanceHallId(e.target.value)} required style={modalInputStyle}>
                    <option value="">Название зала</option>
                    {halls.map(hall => (
                      <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <label style={modalLabelStyle}>Название фильма</label>
                  <select value={seanceFilmId} onChange={e => setSeanceFilmId(e.target.value)} required style={modalInputStyle}>
                    <option value="">Название фильма</option>
                    {films.map(film => (
                      <option key={film.id} value={film.id}>{film.film_name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <label style={modalLabelStyle}>Время начала</label>
                  <input type="time" value={seanceTime} onChange={e => setSeanceTime(e.target.value)} required style={modalInputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <ButtonPrimary type="submit">Добавить фильм</ButtonPrimary>
                <ButtonSecondary onClick={closePendingSeance} style={{ width: '139px' }}>
                  Отменить
                </ButtonSecondary>
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '29px' }}>
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '18px',
        color: '#000000',
        margin: 0,
        alignSelf: 'stretch',
      }}>Выбирите зал для открытия/закрытия продаж:</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', alignSelf: 'stretch' }}>
        {halls.map(hall => (
          <HallTab key={hall.id} hall={hall} isActive={selectedHallId === hall.id} onClick={() => setSelectedHallId(hall.id)} />
        ))}
      </div>
      
      {selectedHall && (
        <>
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '18px',
            color: '#000000',
            margin: 0,
            textAlign: 'center',
          }}>Всё готово к открытию</p>
          <ButtonPrimary
            onClick={() => toggleSales(selectedHall.id)}
            style={{
              width: '270px',
              background: selectedHall.hall_open === 1 ? '#d9534f' : '#16A6AF',
            }}
          >
            {selectedHall.hall_open === 1 ? 'Приостановить продажу билетов' : 'Открыть продажу билетов'}
          </ButtonPrimary>
        </>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div style={{ width: '962px', maxWidth: '100%', margin: '0 auto' }}>
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
