import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import ApiService from '../../services/api';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const state = location.state || null;

  if (!state) {
    return <Navigate to="/" />;
  }

  const { film, hall, seance, selectedSeats, totalPrice, date } = state;

  const seatsString = selectedSeats.map(s => `${s.row}/${s.place}`).join(', ');
  
  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new FormData();
      params.set('seanceId', String(seance.id));
      params.set('ticketDate', date || new Date().toISOString().split('T')[0]);
      
      const ticketsToBook = selectedSeats.map(s => ({
        row: s.row,
        place: s.place,
        coast: s.cost
      }));
      params.set('tickets', JSON.stringify(ticketsToBook));

      const result = await ApiService.buyTickets(params);
      const payload = {
        tickets: Array.isArray(result?.tickets) ? result.tickets : null,
        filmName: film.film_name,
        hallName: hall.hall_name,
        seanceTime: seance.seance_time,
        date: date || new Date().toISOString().split('T')[0],
        fallbackSeats: selectedSeats,
        totalPrice,
      };
      // Persist to survive navigation/reloads
      sessionStorage.setItem('ticket_payload', JSON.stringify(payload));
      
      navigate('/ticket', { state: payload });

    } catch (e) {
      setError(e.message);
      console.error('Booking failed:', e);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="payment-page">
      <main className="payment-main layout-990">
        <section className="payment-section">
          <div className="payment-strip payment-strip-top" />
          <div className="payment-header">
            <h2 className="payment-title">Вы выбрали билеты:</h2>
          </div>

          <div className="payment-ticket-wrapper">
            <div className="payment-ticket-info">
              <p className="payment-line">
                <span className="payment-line-label">На фильм:&nbsp;</span>
                <span className="payment-line-value">{film.film_name}</span>
              </p>
              <p className="payment-line">
                <span className="payment-line-label">Места:&nbsp;</span>
                <span className="payment-line-value">{seatsString}</span>
              </p>
              <p className="payment-line">
                <span className="payment-line-label">В зале:&nbsp;</span>
                <span className="payment-line-value">{hall.hall_name}</span>
              </p>
              <p className="payment-line">
                <span className="payment-line-label">Начало сеанса:&nbsp;</span>
                <span className="payment-line-value">{seance.seance_time}</span>
              </p>
              <p className="payment-line">
                <span className="payment-line-label">Стоимость:&nbsp;</span>
                <span className="payment-line-value">{totalPrice} рублей</span>
              </p>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="payment-button"
            >
              {loading ? 'Обработка...' : 'Получить код бронирования'}
            </button>

            {error && (
              <p className="payment-error">Ошибка бронирования: {error}</p>
            )}

            <div className="payment-hint-block">
              <p className="payment-hint">
                После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.
              </p>
              <p className="payment-hint">Приятного просмотра!</p>
            </div>
          </div>
          <div className="payment-strip payment-strip-bottom" />
        </section>
      </main>
    </div>
  );
};

export default PaymentPage;
