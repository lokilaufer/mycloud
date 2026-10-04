import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FEATURES = [
  { title: 'Загрузка файлов', text: 'Загружайте файлы с комментариями в пару кликов.' },
  { title: 'Скачивание', text: 'Скачивайте свои файлы в любое время.' },
  { title: 'Переименование', text: 'Меняйте имена и комментарии без ограничений.' },
  { title: 'Общий доступ', text: 'Делитесь файлами по обезличенным ссылкам.' },
  { title: 'Админ-панель', text: 'Управляйте пользователями и их хранилищами.' },
  { title: 'Безопасность', text: 'Сессии, CSRF-защита, разграничение прав.' },
];

export default function Home() {
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="container">
      <div className="home-hero">
        <h1>Облачное хранилище My Cloud</h1>
        <p>
          Загружайте, храните, переименовывайте и делитесь файлами.
          Всё в одном месте — просто и безопасно.
        </p>

        <div className="home-actions">
          {!user && (
            <>
              <Link to="/register" className="btn">Создать аккаунт</Link>
              <Link to="/login" className="btn btn-secondary">Войти</Link>
            </>
          )}
          {user && (
            <Link to="/storage" className="btn">Перейти в хранилище</Link>
          )}
        </div>
      </div>

      <h2>Возможности</h2>
      <div className="features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
