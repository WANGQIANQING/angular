import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  searchEvent: EventEmitter<ProductSearchParams> = new EventEmitter();

  constructor(private http: HttpClient) {
  }

  getAllCategories(): string[] {
    return ['穿戴', '居家', '高贵', '奢华', '书籍', '涵养', '电子产品', '通话', '办公'];
  }

  getProducts(): Observable<Product[]> {
    return this.http.get('/api/products').map((res) => <Product[]>res);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get('/api/product/' + id).map(res => <Product>res);
  }

  getCommentsForProductId(id: number): Observable<Comment[]> {
    return this.http.get('/api/product/' + id + '/comments').map(res => <Comment[]>res);
  }

  search(params: ProductSearchParams) {
    return this.http.get('/api/products', {params: this.encodeParams(params)}).map(res => <Product[]>res);
  }

  private encodeParams(params: ProductSearchParams) {
    return Object.keys(params)
      .filter(key => params[key])
      .reduce((sum: HttpParams, key: string) => {
        return sum.append(key, params[key]);
      }, new HttpParams());
  }

  getImgUrlForProductId(id: number): string[] {
    return [
      `../../assets/${id}.1.jpg`,
      `../../assets/${id}.2.jpg`,
      `../../assets/${id}.3.jpg`,
      `../../assets/${id}.4.jpg`,
      `../../assets/${id}.5.jpg`
    ];
  }
}

export class ProductSearchParams {

  constructor(public title: string,
              public price: number,
              public category: string) {
  }
}

export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public desc: string,
    public categories: Array<string>,
  ) {
  }
}

export class Comment {
  constructor(
    public id: number,
    public productId: number,
    public timestamp: string,
    public user: string,
    public rating: number,
    public content: string
  ) {
  }
}
