import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, authError } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new FormData();
    params.set('login', email);
    params.set('password', password);
    login(params);
  };

  return (
    <div className="flex justify-center" style={{ paddingTop: '35px' }}>
      <div style={{ width: '480px', maxWidth: '100%' }}>
        <div style={{
          background: '#63536C',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '57px',
          padding: '16px 104px',
          boxSizing: 'border-box',
        }}>
          <h2 style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '22px',
            lineHeight: '25px',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: 0,
          }}>Авторизация</h2>
        </div>
        <div style={{
          background: 'rgba(234, 233, 235, 0.95)',
          padding: '35px 104px',
          position: 'relative',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '14px',
                color: '#848484',
                marginBottom: '2px',
              }} htmlFor="email">
                E-mail
              </label>
              <input
                style={{
                  width: '272px',
                  maxWidth: '100%',
                  height: '35px',
                  padding: '8px 9px',
                  background: '#FFFFFF',
                  border: '1px solid #B7B7B7',
                  boxSizing: 'border-box',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '16px',
                  color: '#333',
                }}
                id="email"
                type="email"
                placeholder="example@domain.xyz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '14px',
                color: '#848484',
                marginBottom: '2px',
              }} htmlFor="password">
                Пароль
              </label>
              <input
                style={{
                  width: '272px',
                  maxWidth: '100%',
                  height: '35px',
                  padding: '8px 9px',
                  background: '#FFFFFF',
                  border: '1px solid #B7B7B7',
                  boxSizing: 'border-box',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '16px',
                  color: '#333',
                }}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {authError && <p style={{
              textAlign: 'center',
              marginBottom: '12px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '14px',
              color: '#DC2626',
            }}>{authError}</p>}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                style={{
                  width: '189px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#16A6AF',
                  borderRadius: '3px',
                  border: 'none',
                  boxShadow: '0px 3px 3px rgba(0,0,0,0.24), 0px 0px 3px rgba(0,0,0,0.12)',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                Авторизоваться
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
