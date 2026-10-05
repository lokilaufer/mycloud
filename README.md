# ☁️ My Cloud

**Облачное хранилище файлов** — SPA-приложение с бэкендом на Django и фронтендом на React.

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.16-A30000)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/license-Educational-blue)](#лицензия)

---

## 📑 Содержание

- [О проекте](#-о-проекте)
- [Возможности](#-возможности)
- [Стек технологий](#-стек-технологий)
- [Структура проекта](#-структура-проекта)
- [Требования](#-требования)
- [Установка и запуск](#-установка-и-запуск)
- [Учётные данные](#-учётные-данные)
- [API](#-api)
- [Подсказки по интерфейсу](#-подсказки-по-интерфейсу)
- [Развёртывание на reg.ru](#-развёртывание-на-regru)
- [Логирование](#-логирование)
- [Лицензия](#-лицензия)

---

## 📖 О проекте

**My Cloud** — веб-приложение для хранения файлов. Позволяет загружать, скачивать, переименовывать и удалять файлы, оставлять комментарии и делиться файлами по обезличенным специальным ссылкам. Администратор управляет пользователями и их хранилищами.

Приложение построено как **SPA (Single Page Application)**: интерфейс полностью формируется на стороне клиента, обмен данными с сервером — через REST API в формате JSON.

---

## ✨ Возможности

### Пользовательская часть

| Раздел | Что делает |
|--------|-----------|
| **Главная страница** | Информация о приложении, кнопки «Регистрация» и «Вход» |
| **Регистрация** | Логин, полное имя, email, пароль с клиентской и серверной валидацией |
| **Аутентификация** | Вход по логину и паролю, сессия сохраняется в cookie |
| **Выход** | Завершение сессии |

**Правила валидации:**

- **Логин** — только латиница и цифры, первый символ — буква, длина 4–20
- **Email** — проверка по регулярному выражению
- **Пароль** — минимум 6 символов, минимум одна заглавная буква, одна цифра, один спецсимвол

### Административная часть

Доступна только пользователям с признаком «администратор»:

- Список пользователей с логином, полным именем, email, признаком «админ»
- Информация о хранилищах: количество и размер файлов
- Удаление пользователей
- Переключение признака «администратор»
- Переход к хранилищу любого пользователя

### Хранилище

Доступно любому аутентифицированному пользователю:

- Список файлов с полями: имя, комментарий, размер, дата загрузки, дата последнего скачивания
- Загрузка нового файла с комментарием
- Скачивание с оригинальным именем
- Переименование, изменение комментария, удаление
- Формирование специальной обезличенной ссылки
- Скачивание по специальной ссылке **без аутентификации**

---

## 🛠 Стек технологий

### Бэкенд

| Технология | Версия | Назначение |
|:----------:|:------:|-----------|
| **Python** | 3.12 | Язык разработки |
| **Django** | 5.2 | Веб-фреймворк |
| **Django REST Framework** | 3.16 | REST API |
| **PostgreSQL** | 17 | СУБД |
| **psycopg** | 3.x | Драйвер PostgreSQL |
| **django-cors-headers** | 4.x | CORS для dev-режима |
| **python-dotenv** | 1.x | Переменные окружения |

### Фронтенд

| Технология | Версия | Назначение |
|:----------:|:------:|-----------|
| **JavaScript** | ES2022+ | Язык разработки |
| **React** | 19 | UI-библиотека |
| **Redux Toolkit** | 2.x | Управление состоянием |
| **React Router** | 7.x | Маршрутизация SPA |
| **Axios** | 1.x | HTTP-клиент |
| **Webpack (CRA 5)** | 5.x | Сборка |

### Инфраструктура

| Инструмент | Назначение |
|:----------:|-----------|
| **Git + GitHub** | Контроль версий |
| **reg.ru** | Хостинг |
| **nginx + gunicorn** | Продакшен-сервер |

---

## 📂 Структура проекта

```
mycloud/
├── backend/                            # Django-бэкенд
│   ├── mycloud/                        # Настройки проекта
│   │   ├── config.py                   # Параметры (БД, SECRET_KEY, STORAGE_ROOT)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── users/                          # Приложение пользователей
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_create_admin.py    # data-миграция: создание admin
│   │   ├── models.py                   # User (кастомный)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── storage/                        # Приложение хранилища
│   │   ├── migrations/
│   │   │   └── 0001_initial.py
│   │   ├── models.py                   # File
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── storage_root/                   # Файлы пользователей (не в git)
│   ├── venv/                           # Виртуальное окружение (не в git)
│   ├── manage.py
│   └── requirements.txt
├── frontend/                           # React-фронтенд
│   ├── public/
│   ├── src/
│   │   ├── api/client.js               # axios с CSRF
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── Storage.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── usersSlice.js
│   │   │   └── filesSlice.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── build/                          # Собранная статика (не в git)
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

---

## 📋 Требования

| Компонент | Минимум | Рекомендуется |
|-----------|:-------:|:-------------:|
| **Python** | 3.10 | 3.12 |
| **PostgreSQL** | 14 | 17 |
| **Node.js** | 18 | 20–22 |
| **npm** | 10 | 10+ |
| **Git** | любая | последняя |

---

## 🚀 Установка и запуск

### Шаг 1. Клонирование

```bash
git clone https://github.com/lokilaufer/mycloud.git
cd mycloud
```

### Шаг 2. PostgreSQL

Создайте базу данных и пользователя:

```sql
CREATE DATABASE mycloud_db;
CREATE USER mycloud_user WITH PASSWORD 'mycloud_pass';
ALTER ROLE mycloud_user SET client_encoding TO 'utf8';
ALTER ROLE mycloud_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE mycloud_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE mycloud_db TO mycloud_user;
ALTER DATABASE mycloud_db OWNER TO mycloud_user;
```

Подключитесь к БД и выдайте права на схему `public`:

```sql
\c mycloud_db
GRANT ALL ON SCHEMA public TO mycloud_user;
ALTER SCHEMA public OWNER TO mycloud_user;
```

> Порт PostgreSQL по умолчанию — `5432`. Если занят, укажите свой в `backend/mycloud/config.py`.

### Шаг 3. Бэкенд

```bash
cd backend
```

**Виртуальное окружение:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

**Зависимости:**

```bash
pip install -r requirements.txt
```

**Проверьте `backend/mycloud/config.py`:**

```python
SECRET_KEY = '...'
DEBUG = True
ALLOWED_HOSTS = ['*']

DB_NAME = 'mycloud_db'
DB_USER = 'mycloud_user'
DB_PASSWORD = 'mycloud_pass'
DB_HOST = 'localhost'
DB_PORT = '5432'

STORAGE_ROOT = ...
```

**Миграции:**

```bash
python manage.py migrate
```

> Миграция `0002_create_admin` автоматически создаёт администратора `admin / Admin123!`.

**Запуск сервера:**

```bash
python manage.py runserver
```

Django: `http://127.0.0.1:8000/`

### Шаг 4. Фронтенд

Откройте **второй терминал**:

```bash
cd frontend
npm install
```

**Для разработки:**

```bash
npm start
```

React: `http://localhost:3000/`. Все запросы `/api/...` проксируются в Django (см. `proxy` в `package.json`).

### Шаг 5. Сборка и отдача из Django

```bash
cd frontend
npm run build
```

Появится папка `frontend/build/`. Django настроен на её отдачу автоматически.

**Готово:** приложение доступно с одного сервера — `http://127.0.0.1:8000/`

**После изменений во фронтенде:**

1. Правки в `frontend/src/`
2. `npm run build`
3. Обновить страницу `http://127.0.0.1:8000/`

---

## 🔑 Учётные данные

| Роль | Логин | Пароль |
|:----:|:-----:|:------:|
| Администратор | `admin` | `Admin123!` |
| Пользователь | `testuser` | `Test123!` |

> ⚠️ В продакшене обязательно смените пароль `admin`.

---

## 🔌 API

Все запросы — JSON, аутентификация — по сессии (cookie).

### Пользователи

| Метод | Endpoint | Описание | Доступ |
|:-----:|----------|----------|:------:|
| `POST` | `/api/register/` | Регистрация | Аноним |
| `POST` | `/api/login/` | Аутентификация | Аноним |
| `POST` | `/api/logout/` | Выход | Auth |
| `GET` | `/api/me/` | Текущий пользователь | Auth |
| `GET` | `/api/users/` | Список пользователей | Админ |
| `PATCH` | `/api/users/<id>/` | Изменить `is_admin` | Админ |
| `DELETE` | `/api/users/<id>/` | Удалить пользователя | Админ |

### Файлы

| Метод | Endpoint | Описание | Доступ |
|:-----:|----------|----------|:------:|
| `GET` | `/api/files/` | Список файлов (админ: `?user_id=<id>`) | Auth |
| `POST` | `/api/files/upload/` | Загрузка файла (`file`, `comment`) | Auth |
| `PATCH` | `/api/files/<id>/` | Изменить `original_name` / `comment` | Владелец |
| `DELETE` | `/api/files/<id>/` | Удалить файл | Владелец |
| `GET` | `/api/files/<id>/download/` | Скачать с оригинальным именем | Владелец |
| `POST` | `/api/files/<id>/share/` | Получить специальную ссылку | Владелец |
| `GET` | `/api/s/<uuid>/` | Скачать по специальной ссылке | Аноним |

### Отладка

| URL | Назначение |
|-----|-----------|
| `/api/auth/login/` | Страница входа DRF |
| `/admin/` | Django admin |

---

## 💡 Подсказки по интерфейсу

- **Меню навигации** меняется в зависимости от состояния аутентификации:
  - **Гость** — «Вход», «Регистрация»
  - **Пользователь** — «Хранилище», имя, «Выход»
  - **Администратор** — дополнительно «Админ-панель»
- **Загрузка файла** — на странице «Хранилище»: выберите файл, добавьте комментарий, нажмите «Загрузить»
- **Специальная ссылка** — кнопка «Ссылка» рядом с файлом. URL копируется в буфер обмена
- **Редактирование** — кнопки «Переименовать» и «Комментарий» открывают окно ввода
- **Удаление** — подтверждается диалогом
- **Админ-панель** — чекбокс переключает признак «админ»; ссылка «Открыть» ведёт в хранилище пользователя
- **Единый сервер** — после сборки открывайте только `http://127.0.0.1:8000/`

---

## 🌍 Развёртывание на reg.ru

Требуется VPS с Ubuntu 22.04+.

### 1. Установка пакетов

```bash
apt update
apt install -y python3 python3-venv python3-pip \
               postgresql postgresql-contrib \
               nginx git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### 2. PostgreSQL

```bash
sudo -u postgres psql
```

Выполните SQL из [шага 2 установки](#шаг-2-postgresql).

### 3. Клонирование

```bash
mkdir -p /var/www/mycloud
cd /var/www/mycloud
git clone https://github.com/lokilaufer/mycloud.git .
```

### 4. Бэкенд

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Отредактируйте `backend/mycloud/config.py`:

```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.ru', '123.45.67.89']
```

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

### 5. Фронтенд

```bash
cd ../frontend
npm install
npm run build
```

### 6. Gunicorn

Создайте `/etc/systemd/system/mycloud.service`:

```ini
[Unit]
Description=My Cloud Django
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/mycloud/backend
Environment="PATH=/var/www/mycloud/backend/venv/bin"
ExecStart=/var/www/mycloud/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/run/mycloud.sock \
    mycloud.wsgi:application

[Install]
WantedBy=multi-user.target
```

Запустите:

```bash
source /var/www/mycloud/backend/venv/bin/activate
pip install gunicorn
sudo systemctl daemon-reload
sudo systemctl enable --now mycloud
sudo systemctl status mycloud
```

### 7. Nginx

Создайте `/etc/nginx/sites-available/mycloud`:

```nginx
server {
    listen 80;
    server_name your-domain.ru;

    client_max_body_size 100M;

    location /static/ {
        alias /var/www/mycloud/frontend/build/static/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/mycloud.sock;
    }
}
```

Активируйте:

```bash
sudo ln -s /etc/nginx/sites-available/mycloud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Проверка

Откройте `http://your-domain.ru/` — должна открыться главная страница.

---

## 📊 Логирование

Сервер пишет события в консоль с датой, временем, уровнем и именем логгера:

```
2026-10-05 00:00:03,558 INFO django.utils.autoreload Watching for file changes with StatReloader
2026-10-05 00:01:12,001 INFO users User logged in: testuser
2026-10-05 00:01:30,123 INFO storage User testuser uploaded file test.txt
2026-10-05 00:02:05,800 WARNING users Login failed for: nosuchuser
2026-10-05 00:03:44,500 ERROR django.request Internal Server Error: /api/files/
```

Уровни: `DEBUG`, `INFO`, `WARNING`, `ERROR`. Настроено в `settings.py` → `LOGGING`.

---

## 📌 Статус проекта

| Функция | Статус |
|---------|:------:|
| Бэкенд на Django + DRF | ✅ |
| PostgreSQL | ✅ |
| Кастомная модель пользователя | ✅ |
| Регистрация, аутентификация, logout | ✅ |
| Админ-панель | ✅ |
| Файловое хранилище | ✅ |
| Специальные ссылки для внешнего доступа | ✅ |
| SPA на React + Redux + Router | ✅ |
| Единый сервер (Django + статика) | ✅ |
| Логирование | ✅ |
| Развёртывание на reg.ru | ✅ |

---

## 📄 Лицензия

Учебный проект. Свободно используется в портфолио и в образовательных целях.

---

<div align="center">

**Дипломный проект, 2026**

Сделано с ❤️ на Django и React

</div>
