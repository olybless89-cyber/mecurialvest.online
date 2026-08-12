<?php
/**
 * Static site router for Railway deployment.
 * Maps clean URLs to HTML files in the public directory.
 */

$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$path = rtrim($path, '/');

// Map of routes to HTML files
$routes = [
    ''                => 'index.html',
    '/'               => 'index.html',
    '/business'       => 'business.html',
    '/personal'       => 'personal.html',
    '/cards'          => 'cards.html',
    '/loans'          => 'loans.html',
    '/contact'        => 'contact.html',
    '/login'          => 'login.html',
    '/register'       => 'register.html',
    '/about'          => 'about.html',
    '/faq'            => 'faq.html',
    '/apps'           => 'apps.html',
    '/privacy-policy' => 'privacy-policy.html',
    '/terms-of-service' => 'terms-of-service.html',
];

// Serve static assets directly
$filePath = __DIR__ . $path;
if ($path !== '' && file_exists($filePath) && !is_dir($filePath)) {
    return false; // Let PHP built-in server serve static files
}

// Route to HTML file
if (isset($routes[$path])) {
    $htmlFile = __DIR__ . '/' . $routes[$path];
    if (file_exists($htmlFile)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($htmlFile);
        exit;
    }
}

// 404 fallback
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
exit;
