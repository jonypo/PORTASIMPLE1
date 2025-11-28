# Gryst Photo - Portfolio Clone

Un clon del portafolio de fotografía Gryst Photo construido con Django.

## Características

- Diseño oscuro con fondo marrón que replica exactamente el original
- Sidebar con logo y navegación
- Galería de imágenes con navegación por flechas
- Categorías: Fashion, Blog, About, Gear Rental
- Diseño responsive
- Navegación por teclado y touch/swipe
- Iconos de redes sociales

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   pip install django pillow
   ```

3. Ejecuta las migraciones:
   ```bash
   python manage.py migrate
   ```

4. Crea un superusuario:
   ```bash
   python manage.py createsuperuser
   ```

5. Ejecuta el servidor:
   ```bash
   python manage.py runserver
   ```

## Uso

1. Accede a ` http://localhost:8000/admin/` con las credenciales del superusuario
2. Sube imágenes en la sección "Portfolio Images"
3. Asigna categorías y orden a las imágenes
4. Visita `http://localhost:8000/` para ver el portafolio

## Estructura del Proyecto

```
portasimple/
├── gryst_photo/          # Configuración principal de Django
├── portfolio/            # App principal del portafolio
├── static/              # Archivos estáticos (CSS, JS, imágenes)
├── media/               # Imágenes subidas por usuarios
└── templates/           # Templates HTML
```

## Tecnologías Utilizadas

- **Backend**: Django 5.0
- **Frontend**: HTML5, CSS3, JavaScript
- **Base de Datos**: SQLite
- **Iconos**: Font Awesome
- **Imágenes**: Pillow (PIL)

## Personalización

- Modifica los colores en `static/css/style.css`
- Cambia el logo en el template
- Agrega más categorías en `portfolio/models.py`
- Personaliza las animaciones en `static/js/gallery.js`

## Créditos

Clon del diseño original de Gryst Photo (grystphoto.com) 