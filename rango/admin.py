from django.contrib import admin
from rango.models import *

class CategoryAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug':('name',)}
class PageAdmin(admin.ModelAdmin):
	list_display = ('title', 'category', 'url')


admin.site.register(Category,CategoryAdmin)
admin.site.register(Page,PageAdmin)
admin.site.register(UserProfile)

# Register your models here.
