FROM php:8.3-cli

RUN docker-php-ext-install pdo_pgsql

WORKDIR /var/www/html
COPY . .

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-80} -t /var/www/html"]