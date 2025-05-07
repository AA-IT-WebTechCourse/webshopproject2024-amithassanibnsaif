from rest_framework import serializers
from .models import Item, CartItem

class ItemSerializer(serializers.ModelSerializer):
    seller = serializers.ReadOnlyField(source='seller.username')
    price = serializers.FloatField()  # ✅ force float type for JS

    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'price', 'stock', 'seller', 'date_added', 'status']


class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()  # ✅ include full item info

    class Meta:
        model = CartItem
        fields = ['id', 'item', 'price_at_add_time']

