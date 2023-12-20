import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private orderUrl = environment.luv2shopApiUrl + "/orders";

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory>{
    const oredrHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    return this.httpClient.get<GetResponseOrderHistory>(oredrHistoryUrl);
  }
}

interface GetResponseOrderHistory{
  _embedded:{
    orders: OrderHistory[];
  }
}
