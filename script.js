if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('SW registrado correctamente', reg)
                reg.addEventListener('updatefound', () => {
                    reg.installing?.addEventListener('statechange', e => {
                        if (e.target.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('Nueva versión disponible — recarga para actualizar')
                        }
                    })
                })
            })
            .catch(err => console.warn('Error al registrar el SW', err))
    })
}
