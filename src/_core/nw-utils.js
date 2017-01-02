// Set actual page zoom, 1 = 100%, 0.5 = 50%, 2 = 200%, etc...
const zoom = (v) => {
    if (nw.win) {
        v = v || 1
        nw.win.zoomLevel = Math.log(v) / Math.log(1.2)
        return nw.win.zoomLevel
    }
}

((self = window) => {
    if (!self.nw)
        require('./nw-init.js').default(self)
    Object.defineProperty(self.nw, 'zoom', {
        get: () => zoom(),
        set: (value) => zoom(value)
    });
})()

export {
    zoom
}