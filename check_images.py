import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portasimple.settings')
django.setup()

from portfolio.models import PortfolioImage

count = PortfolioImage.objects.count()
print(f"Total images in database: {count}")
if count > 0:
    print("Images found:")
    for img in PortfolioImage.objects.all():
        print(f"- {img.title} ({img.image.url})")
