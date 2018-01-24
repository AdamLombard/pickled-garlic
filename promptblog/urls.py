from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from blog import views

router = routers.DefaultRouter()
router.register(r'posts', views.PostViewSet, 'post')
router.register(r'comments', views.CommentViewSet, 'comment')

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.index, name='index'),
    url(r'^posts/(?P<id>\d+)/$', views.post_detail, name='post_detail'),
    url(r'^newpost/', views.new_post, name='new_post'),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
