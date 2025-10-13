from django.shortcuts import render
from django.http import Http404
from .models import PortfolioImage

# Create your views here.

def home(request):
    images = PortfolioImage.objects.all()
    
    # Check if this is a preview request
    preview_id = request.GET.get('preview')
    if preview_id:
        try:
            preview_image = PortfolioImage.objects.get(id=preview_id)
            return render(request, 'portfolio/home.html', {
                'images': images,
                'preview_image': preview_image,
                'is_preview': True
            })
        except PortfolioImage.DoesNotExist:
            pass
    
    return render(request, 'portfolio/home.html', {'images': images})

def category_view(request, category):
    # Validate category against model choices
    valid_categories = {key for key, _ in PortfolioImage._meta.get_field('category').choices}
    if category not in valid_categories:
        raise Http404("Categoría no encontrada")
    images = PortfolioImage.objects.filter(category=category)
    return render(request, 'portfolio/category.html', {
        'images': images,
        'category': category
    })
