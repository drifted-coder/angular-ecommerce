import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  constructor(private httpClient: HttpClient) { }

   // to get the countries from REST API
   private countriesUrl = "http://localhost:8080/api/countries";
   private statesUrl = "http://localhost:8080/api/states";

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{

    // serach url
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }

    // help us for returning the month
    getCreitCardMonths(startMonth: number): Observable<number[]>{
      let data: number[] = [];
      // build an array for month dropdown list
      // -start at current month and loop until
      for(let theMonth = startMonth; theMonth <= 12; theMonth++){
        data.push(theMonth);
    }
    // the of is used for returning an observeable
    return of(data);
  }

  // help us for returning the year
  getCreditCardYear(): Observable<number[]>{
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  } 
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}