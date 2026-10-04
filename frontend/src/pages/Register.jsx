import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearRegisterState } from '../store/authSlice';

export default function Register() {
  const [form, setForm] = useState({
    login: '',
    full_name: '',
    email: '',
    password: '',
  });
  const [validation, setValidation] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerError, registerSuccess } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(clearRegisterState());
  }, [dispatch]);

  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => navigate('/login'), 1500);
      return () => clearTimeout(timer);
    }
  }, [registerSuccess, navigate]);

  const validate = () => {
    const errs = {};
    if (!/^[A-Za-z][A-Za-z0-9]{3,19}$/.test(form.login)) {
      errs.login = 'Только латиница и цифры, первый символ — буква, длина 4–20';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      errs.email = 'Некорректный email';
    }
    if (form.password.length < 6) {
      errs.password = 'Минимум 6 символов';
    } else if (!/[A-Z]/.test(form.password)) {
      errs.password = 'Нужна заглавная буква';
    } else if (!/\d/.test(form.password)) {
      errs.password = 'Нужна цифра';
    } else if (!/[^A-Za-z0-9]/.test(form.password)) {
      errs.password = 'Нужен спецсимвол';
    }
    if (!form.full_name.trim()) {
      errs.full_name = 'Введите полное имя';
    }
    return errs;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    setValidation(errs);
    if (Object.keys(errs).length === 0) {
      dispatch(register(form));
    }
  };

  const field = (name, label, type = 'text') => (
    <div className="form-row">
      <label>{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
      {validation[name] && <span className="error">{validation[name]}</span>}
      {registerError && registerError[name] && (
        <span className="error">{registerError[name].join(', ')}</span>
      )}
    </div>
  );

  return (
    <div className="container">
      <h2>Регистрация</h2>
      <p className="muted" style={{ marginBottom: 20 }}>
        Создайте аккаунт, чтобы получить своё облачное хранилище.
      </p>

      <form onSubmit={submit}>
        {field('login', 'Логин')}
        {field('full_name', 'Полное имя')}
        {field('email', 'Email')}
        {field('password', 'Пароль', 'password')}

        <button type="submit" className="btn">Зарегистрироваться</button>

        {registerSuccess && (
          <p className="success">Успешно! Переход на страницу входа...</p>
        )}
        {registerError && registerError.detail && (
          <p className="error" style={{ marginTop: 12 }}>
            {registerError.detail}
          </p>
        )}

        <p className="muted" style={{ marginTop: 16 }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}
