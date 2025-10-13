from django.db import models

# Create your models here.

class PortfolioImage(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='portfolio/')
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=[
        ('fashion', 'Fashion'),
        ('blog', 'Blog'),
        ('about', 'About'),
        ('gear', 'Gear Rental'),
    ])
    background_color = models.CharField(
        max_length=7, 
        default='#0f719b',
        help_text='Color de fondo para imágenes verticales (formato hexadecimal, ej: #0f719b)'
    )
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return self.title
