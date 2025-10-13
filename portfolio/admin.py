from django.contrib import admin
from django import forms
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import PortfolioImage

class PortfolioImageForm(forms.ModelForm):
    background_color = forms.CharField(
        widget=forms.TextInput(attrs={'type': 'color'}),
        help_text='Selecciona el color de fondo para imágenes verticales'
    )
    
    class Meta:
        model = PortfolioImage
        fields = '__all__'

@admin.register(PortfolioImage)
class PortfolioImageAdmin(admin.ModelAdmin):
    form = PortfolioImageForm
    list_display = ('title', 'category', 'image_preview', 'background_color', 'order', 'view_on_site', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('order', 'created_at')
    list_editable = ('order',)
    readonly_fields = ('image_preview', 'view_on_site')
    
    fieldsets = (
        ('Información básica', {
            'fields': ('title', 'image', 'image_preview', 'description', 'category')
        }),
        ('Configuración visual', {
            'fields': ('background_color', 'order'),
            'description': 'El color de fondo se aplicará cuando la imagen sea vertical (más alta que ancha)'
        }),
        ('Vista previa', {
            'fields': ('view_on_site',),
            'description': 'Haz clic en el enlace para ver cómo se ve esta imagen en la página real'
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" />',
                obj.image.url
            )
        return "Sin imagen"
    image_preview.short_description = "Vista previa"
    
    def view_on_site(self, obj):
        if obj.id:
            return format_html(
                '<a href="{}" target="_blank" style="background: #0f719b; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold;">Ver en la página</a>',
                reverse('home') + f'?preview={obj.id}'
            )
        return "Guardar primero"
    view_on_site.short_description = "Vista en sitio"
