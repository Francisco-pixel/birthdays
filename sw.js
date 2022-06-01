let cache_name = "cache-birthday",
cache_file = [
    "./",
    "./js/config.js"
],
img=[
    "cumple",
    "192x192",
    "128x128",
    "birthday",
    "96x96"
],
css=[
    "style"
]
link=[
    "francisco-pixel.github.io/modulos/css/style.css",
    "https://francisco-pixel.github.io/modulos/css/style.css",
    "kit.fontawesome.com/925af5c22c.js"
];
img.forEach(data=>cache_file.push(`./img/${data}.png`));
css.forEach(data=>cache_file.push(`./css/${data}.css`));
link.forEach(data=>cache_file.push(`https://${data}`));
/* self.addEventListener("install",e=>{
    const CACHEADO=caches.open(cache_name)
    .then(res=>{
    return res.addAll(cache_file)
    })
    e.waitUntil(CACHEADO);
})

self.addEventListener("fetch",e=>{
    e.respondWith(
        fetch(e.request)
        .catch(()=>caches.match(e.request))
    )
}) */
//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
    self.addEventListener('install', e => {
        e.waitUntil(
            caches.open(cache_name)
                .then(cache => {
                    return cache.addAll(cache_file)
                        .then(() => self.skipWaiting())
                })
                .catch(err => console.log('Falló registro de cache', err))
        )
    })
    
    //una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
    self.addEventListener('activate', e => {
        const cacheWhitelist = [cache_name]
    
        e.waitUntil(
            caches.keys()
                .then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            //Eliminamos lo que ya no se necesita en cache
                            if (cacheWhitelist.indexOf(cacheName) === -1) {
                                return caches.delete(cacheName)
                            }
                        })
                    )
                })
                // Le indica al SW activar el cache actual
                .then(() => self.clients.claim())
        )
    })
    
    //cuando el navegador recupera una url
    self.addEventListener('fetch', e => {
        //Responder ya sea con el objeto en caché o continuar y buscar la url real
        e.respondWith(
            caches.match(e.request)
                .then(res => {
                    if (res) {
                        //recuperar del cache
                        return res
                    }
                    //recuperar de la petición a la url
                    return fetch(e.request)
                })
        )
    })