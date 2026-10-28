FROM php:8.3-cli

RUN docker-php-ext-install pdo_pgsql

WORKDIR /var/www/html
COPY . .

CMD ["sh", "-c", "php -d session.save_path=/tmp -S 0.0.0.0:${PORT:-80} -t /var/www/html"]