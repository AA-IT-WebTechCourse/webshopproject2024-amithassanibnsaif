from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Item, CartItem
from rest_framework.permissions import IsAuthenticated
from .serializers import ItemSerializer, CartItemSerializer
from datetime import datetime




class PopulateDatabaseView(APIView):
    authentication_classes = []  # Public access
    permission_classes = []

    def post(self, request):
        confirm = request.data.get("confirm")
        if confirm != "yes":
            return Response({"error": "Confirmation required"}, status=400)

        created_users = []

        # ✅ Create 6 users (if they don't exist)
        for i in range(1, 7):
            username = f"testuser{i}"
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    password=f"pass{i}",
                    email=f"testuser{i}@shop.aa"
                )
                created_users.append(user)
            else:
                created_users.append(User.objects.get(username=username))

        # ✅ First 3 users are sellers → ensure they each have 10 items
        for seller in created_users[:3]:
            existing_count = Item.objects.filter(seller=seller).count()
            for j in range(existing_count + 1, 11):
                Item.objects.create(
                    title=f"Item {j} from {seller.username}",
                    description=f"This is item {j} by {seller.username}.",
                    price=10 + j,
                    stock=5 + j,
                    status="on-sale",
                    seller=seller,
                    date_added=datetime.now()
                )

        return Response({"message": "✅ Test users and items populated (no deletion)."})

    def delete(self, request):
        # ✅ Delete only test users and all items
        User.objects.filter(username__startswith="testuser").delete()
        Item.objects.all().delete()
        return Response({"message": "🗑️ Test users and items deleted."})

class UserListView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        users = User.objects.all().values("username", "email")
        return Response(list(users))

class ItemListView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        items = Item.objects.all()
        return Response(ItemSerializer(items, many=True).data)


class EditItemView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            item = Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        if item.seller != request.user:
            return Response({"error": "You are not allowed to edit this item."}, status=403)

        price = request.data.get("price")
        stock = request.data.get("stock")

        if price is not None:
            item.price = float(price)

        if stock is not None:
            item.stock = int(stock)

        item.save()

        return Response({"message": "✅ Item updated successfully."})


class AddItemView(generics.CreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class MyItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        on_sale = Item.objects.filter(seller=user, status="on-sale")
        sold = Item.objects.filter(seller=user, buyer__isnull=False)  # ✅ updated
        purchased = Item.objects.filter(buyer=user)

        return Response({
            "on_sale": ItemSerializer(on_sale, many=True).data,
            "sold": ItemSerializer(sold, many=True).data,
            "purchased": ItemSerializer(purchased, many=True).data
        })

    
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(buyer=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            item = Item.objects.get(id=request.data['item_id'])

            if item.seller == request.user:
                return Response({"error": "Cannot add your own item."}, status=403)

            cart_item, created = CartItem.objects.get_or_create(
                buyer=request.user,
                item=item,
                defaults={'price_at_add_time': float(item.price)}
            )
            return Response({"message": "✅ Added to cart!"})

        except Item.DoesNotExist:
            return Response({"error": "Item not found."}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def delete(self, request):
        try:
            item_id = request.data.get("item_id")
            cart_item = CartItem.objects.get(buyer=request.user, item__id=item_id)
            cart_item.delete()
            return Response({"message": "🗑️ Item removed from cart."})
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in your cart."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)



class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(buyer=request.user)
        issues = []

        for cart_item in cart_items:
            item = cart_item.item
            if item.stock <= 0:
                issues.append({
                    "title": item.title,
                    "reason": "Out of stock"
                })
                continue

            if item.price != cart_item.price_at_add_time:
                issues.append({
                    "title": item.title,
                    "reason": "Price changed",
                    "new_price": item.price
                })

        if issues:
            return Response({"issues": issues}, status=409)

        # No issues → proceed to purchase
        for cart_item in cart_items:
            item = cart_item.item
            item.stock -= 1
            if item.stock == 0:
                item.status = "sold"
            else:
                item.status = "on-sale"
            item.buyer = request.user
            item.save()
            cart_item.delete()

        return Response({
            "message": "✅ Purchase complete.",
            "status": "success"
        })




class ItemDetailView(APIView):
    def get(self, request, pk):
        try:
            item = Item.objects.get(id=pk)
        except Item.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)
        return Response(ItemSerializer(item).data)


class SearchItemView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        query = request.GET.get("q", "")
        items = Item.objects.filter(title__icontains=query)
        if items.exists():
            return Response(ItemSerializer(items, many=True).data, status=200)
        else:
            return Response({"error": "Item not found"}, status=404)
        
from django.contrib.auth import update_session_auth_hash

