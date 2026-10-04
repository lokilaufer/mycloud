import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFiles, uploadFile, deleteFile, updateFile, shareFile,
} from '../store/filesSlice';

export default function Storage() {
  const [params] = useSearchParams();
  const userId = params.get('user_id');
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.files);
  const currentUser = useSelector((s) => s.auth.user);

  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchFiles(userId));
  }, [dispatch, userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Выберите файл');
      return;
    }
    await dispatch(uploadFile({ file, comment }));
    setFile(null);
    setComment('');
    e.target.reset();
    dispatch(fetchFiles(userId));
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Удалить файл "${name}"?`)) {
      dispatch(deleteFile(id));
    }
  };

  const handleRename = (id, oldName) => {
    const newName = prompt('Новое имя файла:', oldName);
    if (newName && newName !== oldName) {
      dispatch(updateFile({ id, data: { original_name: newName } }));
    }
  };

  const handleComment = (id, oldComment) => {
    const newComment = prompt('Комментарий:', oldComment || '');
    if (newComment !== null) {
      dispatch(updateFile({ id, data: { comment: newComment } }));
    }
  };

  const handleShare = async (id) => {
    const res = await dispatch(shareFile(id));
    if (res.meta.requestStatus === 'fulfilled') {
      const url = `${window.location.origin}/api/s/${res.payload.special_link}/`;
      try {
        await navigator.clipboard.writeText(url);
        alert('Ссылка скопирована:\n' + url);
      } catch {
        prompt('Скопируйте ссылку:', url);
      }
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
  };

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleString('ru-RU') : '—');

  return (
    <div className="container">
      <h2>
        Хранилище
        {userId && userId !== String(currentUser?.id) && (
          <span className="muted"> (пользователь ID: {userId})</span>
        )}
      </h2>

      {(!userId || userId === String(currentUser?.id)) && (
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Комментарий к файлу"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="btn">Загрузить</button>
        </form>
      )}

      {loading && <p className="muted">Загрузка...</p>}

      {!loading && list.length === 0 && (
        <div className="empty">Файлов пока нет. Загрузите первый файл.</div>
      )}

      {!loading && list.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Комментарий</th>
                <th>Размер</th>
                <th>Загружен</th>
                <th>Скачан</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id}>
                  <td>{f.original_name}</td>
                  <td>{f.comment || '—'}</td>
                  <td>{formatSize(f.size)}</td>
                  <td>{formatDate(f.uploaded_at)}</td>
                  <td>{formatDate(f.last_downloaded_at)}</td>
                  <td className="actions">
                    <a
                      href={`/api/files/${f.id}/download/`}
                      className="btn-small"
                    >
                      Скачать
                    </a>
                    <button
                      className="btn-small"
                      onClick={() => handleRename(f.id, f.original_name)}
                    >
                      Переименовать
                    </button>
                    <button
                      className="btn-small"
                      onClick={() => handleComment(f.id, f.comment)}
                    >
                      Комментарий
                    </button>
                    <button
                      className="btn-small"
                      onClick={() => handleShare(f.id)}
                    >
                      Ссылка
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(f.id, f.original_name)}
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

      {userId && (
        <p style={{ marginTop: 20 }}>
          <Link to="/admin">← Вернуться в админ-панель</Link>
        </p>
      )}
    </div>
  );
}
