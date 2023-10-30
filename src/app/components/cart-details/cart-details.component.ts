import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private cartservice: CartService) { }

  ngOnInit(): void {
    // this method will give all the cart details from cart service
    this.listCartDetails();
  }
  listCartDetails() {
    // adding handler to handle cart items
    this.cartItems = this.cartservice.cartItems;
    // subscribe to the cart totalprice
    this.cartservice.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    );
    // subscribe to the cart total quantity
    this.cartservice.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    );

    // compute cart total price and quantity
    this.cartservice.computeCartTotals();
  }

  // simply call the add to cart function and add the item
  incrementQuantity(theCartItem: CartItem){
    this.cartservice.addToCart(theCartItem);
  }

  // simply decrement the cart value means remove
  decrementQuantity(theCartItem: CartItem){
    this.cartservice.decrementQuantity(theCartItem);
  }
  remove(theCartItem: CartItem) {
    this.cartservice.remove(theCartItem);
  }
}
