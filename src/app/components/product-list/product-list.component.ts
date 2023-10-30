import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  serachMode: boolean = false;
  previousCategoryId: number =1;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize:number = 5;
  theTotalElements:number = 0;

  constructor(private productService: ProductService,private cartService: CartService, private route: ActivatedRoute) { }

  // once the angular initalizes it will call this method automatically
  ngOnInit(){
    this.route.paramMap.subscribe(() => {
      this.listOfProducts();
    });
  }

  listOfProducts(){
    this.serachMode = this.route.snapshot.paramMap.has('keyword');
    if(this.serachMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    console.log(theKeyword+"hello");
    // now search for products using the keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }
  handleListProducts(){
    // check if "id" parameter is availiable
    //route is the activated route
    //snapshot is the state of the route at the given moment in time
    // paramMap map all the route parameter 
    //.has('id') reads the parameter and returns true or false
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      // get the "id param string. + will convert the string of hasCategoryId to number"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      // if not availiable
      this.currentCategoryId = 1;
    }

    // *********old code for fetching data accoding to categories*******   
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // ) 

    //check if we have different category than previous
    // angular will reuse a component if it is currently being viewed

    // if we have different category id than previous then set pageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePgeNumber = ${this.thePageNumber}`);
    // get the data according to the id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }
  processResult() {
      return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listOfProducts();
  }

  addToCart(theProduct: Product){
    console.log(`Adding the product to the cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
