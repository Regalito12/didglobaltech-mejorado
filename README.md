# DIDGLOBALTECH — Web corporativa

Sitio web modular de DIDGLOBALTECH, con identidad navy/turquesa, navegación por módulos y motion progresivo para una experiencia tecnológica más clara y premium.

## Ejecutar localmente

Sirve esta carpeta con cualquier servidor estático. Por ejemplo:

```powershell
python -m http.server 4173
```

Luego abre `http://localhost:4173/index.html`.

## Estructura

- `index.html`: inicio y directorio de módulos.
- `nosotros.html`, `ciberseguridad.html`, `servicios.html`, `soluciones.html`, `marcas.html`, `proyectos.html`, `contacto.html`: módulos independientes.
- `styles.css`, `premium.css`, `script.js`: sistema visual, mejoras premium y comportamiento.
- `assets/`: imágenes y logos locales.

El formulario de contacto abre el cliente de correo corporativo; antes de publicar en producción debe conectarse al canal real de la empresa.
