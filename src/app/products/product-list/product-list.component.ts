import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {
  Observable,
  EMPTY,
  combineLatest,
  Subscription,
  tap,
  catchError,
  startWith,
  count,
  map,
  debounceTime,
  filter,
  timer,
  Subject,
  takeUntil,
} from 'rxjs';

import { Product } from '../product.interface';
import { ProductService } from '../../services/product.service';
import { FavouriteService } from '../../services/favourite.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  title: string = 'Products';
  selectedProduct: Product;
  products$: Observable<Product[]>;
  productsNumber$: Observable<number>;
  errorMessage;

  constructor(
    private productService: ProductService,
    private favouriteService: FavouriteService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.products$ = this.productService.products$.pipe(
      filter((products) => products.length > 0)
    );
    this.productsNumber$ = this.products$.pipe(
      map((products) => products.length),
      startWith(0)
    );
  }

  // Pagination
  productsToLoad = this.productService.productsToLoad;
  pageSize = this.productsToLoad / 2;
  start = 0;
  end = this.pageSize;
  currentPage = 1;

  loadMore(): void {
    let skip: number = this.end;
    let take: number = this.productsToLoad;
    this.productService.initProducts(skip, take);
  }

  previousPage() {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.currentPage--;
    this.selectedProduct = null;
  }

  nextPage() {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.currentPage++;
    this.selectedProduct = null;
  }

  resetPagination() {
    this.start = 0;
    this.end = this.pageSize;
    this.currentPage = 1;
  }

  onSelect(product: Product) {
    this.selectedProduct = product;
    this.router.navigateByUrl('/products/' + product.id);
  }

  get favourites(): number {
    return this.favouriteService.getFavouritesNb();
  }

  reset() {
    this.productService.resetList();
    this.resetPagination();
  }


}
