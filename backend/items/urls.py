from django.urls import path
from .views import PopulateDatabaseView, UserListView, SearchItemView
from .views import ItemListView, AddItemView, MyItemsView, CartView, CheckoutView, ItemDetailView, EditItemView

urlpatterns = [
    path('populate/', PopulateDatabaseView.as_view()),
    path('allusers/', UserListView.as_view()),
    path('allitems/', ItemListView.as_view()),
    path('myitems/', MyItemsView.as_view()),
    path('cart/', CartView.as_view()),
    path('checkout/', CheckoutView.as_view()),
    path('add/', AddItemView.as_view()),
    path('<int:pk>/', ItemDetailView.as_view()),
    path('<int:pk>/edit/', EditItemView.as_view()),
    path('search/', SearchItemView.as_view()),


    
]

