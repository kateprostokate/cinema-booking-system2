import React, { useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const TicketPage = () => {
  const location = useLocation();
  const stored = (() => {
    try {
      const raw = sessionStorage.getItem('ticket_payload');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();
  const state = location.state || stored || null;

  if (!state) {
    return <Navigate to="/" />;
  }

  const { tickets, fallbackSeats, totalPrice, filmName, hallName, seanceTime, date } = state;
  
  const seatsString = (Array.isArray(tickets) && tickets.length > 0)
    ? tickets.map(t => `${t.ticket_row}/${t.ticket_place}`).join(', ')
    : Array.isArray(fallbackSeats)
      ? fallbackSeats.map(s => `${s.row}/${s.place}`).join(', ')
      : '';

  const displayDate = (Array.isArray(tickets) && tickets.length > 0) ? tickets[0].ticket_date : (date || '');
  const displayCost = (Array.isArray(tickets) && tickets.length > 0)
    ? tickets.reduce((sum, t) => sum + t.ticket_price, 0)
    : (typeof totalPrice === 'number' ? totalPrice : 0);

  const qrString = useMemo(() => {
    const ticketInfo = {
      film: filmName,
      hall: hallName,
      time: seanceTime,
      date: displayDate,
      seats: seatsString,
      cost: displayCost,
      info: 'Билет действителен строго на свой сеанс',
      ticketIds: Array.isArray(tickets) && tickets.length > 0 ? tickets.map(t => t.id) : undefined,
    };
    return JSON.stringify(ticketInfo);
  }, [tickets, filmName, hallName, seanceTime, seatsString, displayDate, displayCost]);

  return (
    <div className="ticket-page">
      <main className="ticket-main layout-990">
        <section className="ticket-section">
          <div className="decoration-strip" />
          <div className="ticket-header">
            <h2 className="ticket-title">Электронный билет</h2>
          </div>
          <div className="decoration-strip" />

          <div className="decoration-strip" />
          <div className="ticket-info-wrapper">
            <div className="ticket-info-block">
              <p className="ticket-line">
                <span className="ticket-line-label">На фильм:&nbsp;</span>
                <span className="ticket-line-value">{filmName}</span>
              </p>
              <p className="ticket-line">
                <span className="ticket-line-label">Места:&nbsp;</span>
                <span className="ticket-line-value">{seatsString}</span>
              </p>
              <p className="ticket-line">
                <span className="ticket-line-label">В зале:&nbsp;</span>
                <span className="ticket-line-value">{hallName}</span>
              </p>
              <p className="ticket-line">
                <span className="ticket-line-label">Начало сеанса:&nbsp;</span>
                <span className="ticket-line-value">{seanceTime}</span>
              </p>
              {displayDate && (
                <p className="ticket-line">
                  <span className="ticket-line-label">Дата:&nbsp;</span>
                  <span className="ticket-line-value">{displayDate}</span>
                </p>
              )}
            </div>

            <div className="ticket-qr-wrapper">
              <div className="ticket-qr-inner">
                <QRCode value={qrString} size={200} />
              </div>
            </div>

            <div className="ticket-hint-block">
              <p className="ticket-hint">
                Покажите QR-код нашему контроллеру для подтверждения бронирования.
              </p>
              <p className="ticket-hint">Приятного просмотра!</p>
            </div>
          </div>
          <div className="decoration-strip" />
        </section>
      </main>
    </div>
  );
};

export default TicketPage;
