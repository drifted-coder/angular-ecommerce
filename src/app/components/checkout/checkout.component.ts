import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice:number = 0;
  totalQuantity:number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  checkOutFormGroup: FormGroup;
  // this will help us in creating form with its inbuild functions
  constructor(private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShopFormService, private CartService: CartService, private checkoutService: CheckoutService, private router: Router) { }

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkOutFormGroup = this.formBuilder.group({
      // this one is for grouping the details of customer, here customer is the form group name
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                    [Validators.required, 
                                    Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',
                                    [Validators.required, 
                                    Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',
                                    [Validators.required, 
                                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(5), 
                                Luv2ShopValidators.notOnlyWhiteSpace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(5), 
                                Luv2ShopValidators.notOnlyWhiteSpace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',
                                      [Validators.required,
                                      Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required,
                                        Validators.pattern('[0-9]{16}'),
                                        Luv2ShopValidators.notOnlyWhiteSpace]),
        securityCode:  new FormControl('',[Validators.required,
                                           Validators.pattern('[0-9]{3}'),
                                           Luv2ShopValidators.notOnlyWhiteSpace]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;

    this.luv2ShopFormService.getCreitCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months:- "+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate the credit card years
    this.luv2ShopFormService.getCreditCardYear().subscribe(
      data => {
        console.log("Retrived credit card years:- "+JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

     // for generating countries
     this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log('Retrieved countries: '+JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  reviewCartDetails(){
    // subscribe to cartservice.totalquantity
    this.CartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    // subscribe to cartservice.totalprice
    this.CartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }
  // getters methods for customer
  get firstName(){return this.checkOutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkOutFormGroup.get('customer.lastName');}
  get email(){return this.checkOutFormGroup.get('customer.email');}
  
  // getter methods for shippingAddress
  get shippingAddressStreet(){return this.checkOutFormGroup.get('shippingAddress.street')}
  get shippingAddressCity(){return this.checkOutFormGroup.get('shippingAddress.city')}
  get shippingAddressState(){return this.checkOutFormGroup.get('shippingAddress.state')}
  get shippingAddressCountry(){return this.checkOutFormGroup.get('shippingAddress.country')}
  get shippingAddressZipcode(){return this.checkOutFormGroup.get('shippingAddress.zipCode')}

  // getter methods for billingAddress
  get billingAddressStreet(){return this.checkOutFormGroup.get('billingAddress.street')}
  get billingAddressCity(){return this.checkOutFormGroup.get('billingAddress.city')}
  get billingAddressState(){return this.checkOutFormGroup.get('billingAddress.state')}
  get billingAddressCountry(){return this.checkOutFormGroup.get('billingAddress.country')}
  get billingAddressZipcode(){return this.checkOutFormGroup.get('billingAddress.zipCode')}

  // getter methods for credit card
  get creditCardType(){return this.checkOutFormGroup.get('creditCard.cardType')}
  get creditCardName(){return this.checkOutFormGroup.get('creditCard.nameOnCard')}
  get creditCardNumber(){return this.checkOutFormGroup.get('creditCard.cardNumber')}
  get creditCardSecurityCode(){return this.checkOutFormGroup.get('creditCard.securityCode')}

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkOutFormGroup.controls['billingAddress'].setValue(this.checkOutFormGroup.controls['shippingAddress'].value);

      // bugFix code for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkOutFormGroup.controls['billingAddress'].reset();

      // bugFix code for states
      this.billingAddressStates = [];
    }
    
  }

  hendleMonthAndYear(){
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear:number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;
    // if the current year is the selected year then show the remaining months
    if(selectedYear === currentYear){
      startMonth = new Date().getMonth()+1;
    }
    else{
      startMonth = 1;
    }

    // for generating credit card months
    this.luv2ShopFormService.getCreitCardMonths(startMonth).subscribe(
      data =>{
        console.log('Retrieved crefit card months:'+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string){
    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    // for getting countries when updated
    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
            console.log('Retrieved shipping address states:'+JSON.stringify(data));
            this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }
        // default value
          formGroup.get('state').setValue(data[0]);
      }
    );
  }
  
  onSubmit(){
    console.log('Handling the submit button');

    if(this.checkOutFormGroup.invalid){
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.CartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItems => new OrderItem(tempCartItems));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkOutFormGroup.controls['customer'].value;


    // populate purchase - shipping address
    purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your Order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // reset the cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error ${err.message}`);
        }
      }
    )

    console.log(this.checkOutFormGroup.get('customer').value);
  }

  resetCart() {
    // reset the cart data
    this.CartService.cartItems = [];
    this.CartService.totalPrice.next(0);
    this.CartService.totalQuantity.next(0);

    // reset the form
    this.checkOutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }


}
