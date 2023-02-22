import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  delay,
  shareReplay,
  tap,
  first,
  map,
  mergeAll,
  BehaviorSubject,
  switchMap,
  of,
  filter,
} from 'rxjs';
import { Product } from '../products/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://storerestservice.azurewebsites.net/api/products/';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.productsSubject.asObservable();
  productsTotalNumber$: Observable<number>;
  productsToLoad: number = 10;

  mostExpensiveProduct$: Observable<Product>;

  constructor(private http: HttpClient) {
    this.initProducts();
  }

  initProducts(skip: number = 0, take: number = this.productsToLoad) {
    let url =
      this.baseUrl + `?$skip=${skip}&$top=${take}&$orderby=ModifiedDate%20desc`;

    this.http
      .get<Product[]>(url)
      .pipe(
        shareReplay(),
        map((newProducts) => {
          let currentProducts = this.productsSubject.value;
          return currentProducts.concat(newProducts);
        })
      )
      .subscribe((concatProducts) => this.productsSubject.next(concatProducts));
  }

  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, newProduct);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);
  }

  resetList() {
    this.productsSubject.next([]);
    this.initProducts();
  }
}
