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

## Despliegue en Render

Este proyecto está configurado para desplegarse fácilmente en [Render](https://render.com).

### Pasos para desplegar:

1. Crea una cuenta en Render y conecta tu repositorio de GitHub.
2. Crea un nuevo **Web Service**.
3. Selecciona el repositorio `PORTASIMPLE1`.
4. Render detectará automáticamente la configuración del archivo `render.yaml`.
5. Haz clic en **Create Web Service**.

### Variables de Entorno

Render configurará automáticamente la base de datos PostgreSQL. Sin embargo, debes asegurarte de que la variable `SECRET_KEY` se genere correctamente (está configurada para generarse automáticamente en `render.yaml`).

### Nota Importante

Al usar Render (PostgreSQL), la base de datos local (SQLite) no se subirá. Deberás:
1. Crear un superusuario en la consola de Render (Shell).
2. Volver a subir las imágenes desde el panel de administración en producción. 