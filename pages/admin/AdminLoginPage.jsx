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
    <div className="flex justify-center py-10">
      <div className="w-full max-w-lg shadow-lg">
        <div className="bg-[#63536C] rounded-t-lg p-4 text-center">
          <h2 className="text-xl font-bold text-white uppercase">Авторизация</h2>
        </div>
        <div className="bg-gray-200 bg-opacity-95 rounded-b-lg px-10 py-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs font-normal mb-1" htmlFor="email">
                E-mail
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                id="email"
                type="email"
                placeholder="example@domain.xyz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 text-xs font-normal mb-1" htmlFor="password">
                Пароль
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {authError && <p className="text-red-500 text-xs italic text-center mb-4">{authError}</p>}
            <div className="flex items-center justify-center mt-4">
              <button
                className="bg-[#16A6AF] hover:bg-teal-600 text-white font-medium text-sm uppercase py-3 px-8 rounded-sm shadow-md focus:outline-none focus:shadow-outline transition-colors"
                type="submit"
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
