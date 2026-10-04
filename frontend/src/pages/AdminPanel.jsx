import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, toggleAdmin } from '../store/usersSlice';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id, login) => {
    if (
      window.confirm(
        `Удалить пользователя "${login}"? Все его файлы также будут удалены.`
      )
    ) {
      dispatch(deleteUser(id));
    }
  };

  const handleToggleAdmin = (id, is_admin) => {
    dispatch(toggleAdmin({ id, is_admin: !is_admin }));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
  };

  return (
    <div className="container">
      <h2>Админ-панель</h2>
      <p className="muted" style={{ marginBottom: 20 }}>
        Управление пользователями и их файловыми хранилищами.
      </p>

      {loading && <p className="muted">Загрузка...</p>}

      {!loading && list.length === 0 && (
        <div className="empty">Пользователей пока нет.</div>
      )}

      {!loading && list.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Логин</th>
                <th>Полное имя</th>
                <th>Email</th>
                <th>Админ</th>
                <th>Файлов</th>
                <th>Размер</th>
                <th>Хранилище</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.login}</td>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={u.is_admin}
                      onChange={() => handleToggleAdmin(u.id, u.is_admin)}
                    />
                  </td>
                  <td>{u.files_count}</td>
                  <td>{formatSize(u.files_size)}</td>
                  <td>
                    <Link to={`/storage?user_id=${u.id}`}>Открыть</Link>
                  </td>
                  <td>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(u.id, u.login)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
