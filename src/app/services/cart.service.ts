import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
 
  cartItems: CartItem[] = [];

  // this is the subclass of observable class and it can be used to publish events
  // BehaviourSubject gives us only the latest events
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {
    // read data from storage
    let data = JSON.parse(this.storage.getItem("cartItems"));

    if(data != null){
      this.cartItems = data

      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    // check if we have already that item in the cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    // check cart is empty or not
    if (this.cartItems.length > 0) {
      // find the item exist or not
      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }

      // refactored code for the above code
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      );

      // if we found it
      alreadyExistInCart = existingCartItem != undefined;
    }

    // if exist the just increament the quantity
    if (alreadyExistInCart) {
      existingCartItem.quantity++;
    } else{
      // just simply add the item
      this.cartItems.push(theCartItem);
    }

    // compute the cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    // actual work
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // now just publish this data so that all subscribers cab recieve it
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // this method is for debugging purposes it has no actual effect
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}`
      );
    }

    console.log(
      `totalPrice: ${totalPriceValue.toFixed(
        2
      )}, totalQuantity: ${totalQuantityValue}`
    );
    console.log('------');
  }

  decrementQuantity(theCartItem: CartItem) {
    // like just decrease the items
    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    // get index of the item in the array so that we can check if any thisng exist on cart or not
    // return index if exist otherwise return false
    const itemIndex = this.cartItems.findIndex(tempCartItems => tempCartItems.id === theCartItem.id);

    // check if the index is >-1
    if(itemIndex > -1){
      // this will remove only one element from that index
      this.cartItems.splice(itemIndex,1);

      // compute the cart totals now
      this.computeCartTotals();
    }
  }

  persistCartItems(){
    this.storage.setItem("cartItems", JSON.stringify(this.cartItems));
  }
}
