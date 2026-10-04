import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/authSlice';

export default function Login() {
  const [form, setForm] = useState({ login: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) {
      navigate(user.is_admin ? '/admin' : '/storage');
    }
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === 'fulfilled') {
      const u = res.payload;
      navigate(u.is_admin ? '/admin' : '/storage');
    }
  };

  return (
    <div className="container">
      <h2>Вход</h2>
      <p className="muted" style={{ marginBottom: 20 }}>
        Введите логин и пароль, чтобы продолжить.
      </p>

      <form onSubmit={submit}>
        <div className="form-row">
          <label>Логин</label>
          <input
            type="text"
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
            placeholder="Ваш логин"
            autoComplete="username"
          />
        </div>

        <div className="form-row">
          <label>Пароль</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Ваш пароль"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>

        {error && (
          <p className="error" style={{ marginTop: 12 }}>
            {error.detail || 'Ошибка входа'}
          </p>
        )}

        <p className="muted" style={{ marginTop: 16 }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}
