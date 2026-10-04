import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">My Cloud</Link>
      <div className="nav-links">
        {!user && <Link to="/login">Вход</Link>}
        {!user && <Link to="/register">Регистрация</Link>}
        {user && <Link to="/storage">Хранилище</Link>}
        {user && user.is_admin && <Link to="/admin">Админ-панель</Link>}
        {user && (
          <>
            <span className="nav-user">{user.login}</span>
            <button onClick={handleLogout}>Выход</button>
          </>
        )}
      </div>
    </nav>
  );
}
