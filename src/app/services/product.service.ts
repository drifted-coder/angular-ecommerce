import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // adding the url to fetch the data from the db 
  private baseUrl = "http://localhost:8080/api/products";

  private categoryUrl = "http://localhost:8080/api/product-category";
  // injecting http client 
  constructor(private httpClient: HttpClient) { }

  // this method will map the JSON data from spring data REST to product array
  getProductList(thecategoryId: number): Observable<Product[]>{

      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${thecategoryId}`;

      return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number, 
                          thePageSize: number,
                          thecategoryId: number): Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${thecategoryId}`+`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

      return this.getProducts(searchUrl);
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

// unwraps the JSON from spring data REST _embedded entry
interface GetResponseProducts {
  _embedded:{
    products: Product[];
  },
  // page object to support pagination
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded:{
    productCategory: ProductCategory[];
  }
}