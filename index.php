<?php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = rtrim($path, '/') ?: '/';

$routes = [
    '/'                 => 'index.html',
    '/business'         => 'business.html',
    '/personal'         => 'personal.html',
    '/cards'            => 'cards.html',
    '/loans'            => 'loans.html',
    '/contact'          => 'contact.html',
    '/login'            => 'login.html',
    '/register'         => 'register.html',
    '/about'            => 'about.html',
    '/faq'              => 'faq.html',
    '/apps'             => 'apps.html',
    '/privacy-policy'   => 'privacy-policy.html',
    '/terms-of-service' => 'terms-of-service.html',
];

if (isset($routes[$path])) {
    $file = __DIR__ . '/' . $routes[$path];
    if (file_exists($file)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($file);
        exit;
    }
}

// Fallback: serve index
http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
exit;
