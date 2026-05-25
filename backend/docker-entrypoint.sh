#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "⏳ Checking database connection..."

# Wait for database to be ready if DATABASE_URL is set
python -c "
import sys, socket, time, os
from urllib.parse import urlparse

db_url = os.environ.get('DATABASE_URL')
if db_url and db_url.startswith('postgres'):
    url = urlparse(db_url)
    host = url.hostname
    port = url.port or 5432
    print(f'Waiting for database at {host}:{port}...')
    attempts = 0
    while attempts < 30:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2)
            s.connect((host, port))
            s.close()
            print('Database is ready!')
            sys.exit(0)
        except socket.error:
            attempts += 1
            time.sleep(1)
    print('Timeout waiting for database.')
    sys.exit(1)
else:
    print('No PostgreSQL DATABASE_URL found, skipping check (using SQLite or fallback).')
"

# Create media and static directories if they don't exist
mkdir -p /app/media/partenaires /app/media/temoignages /app/media/articles /app/staticfiles

echo "🗄️ Running migrations..."
python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo "👤 Setting up admin account..."
python manage.py create_admin

echo "🚀 Starting backend with Gunicorn..."
exec gunicorn consulting_api.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --log-level info
