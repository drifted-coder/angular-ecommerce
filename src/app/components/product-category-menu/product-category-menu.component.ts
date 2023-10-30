import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {
  productCategories!: ProductCategory[];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }
  listProductCategories() {
    // this will invoke the service
    this.productService.getProductCategories().subscribe(
      data =>{
        // Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
        console.log('Product categories' + JSON.stringify(data));
        // assigning to the array
        this.productCategories = data;
      }
    )
  }

}
