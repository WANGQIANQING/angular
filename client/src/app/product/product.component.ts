import {Component, OnInit} from '@angular/core';
import {Product, ProductService} from '../shared/product.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: Observable<Product[]>;
  imgUrl = [];

  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.products = this.productService.getProducts();

    this.productService.searchEvent.subscribe(
      params => {
        this.products = this.productService.search(params);
      }
    );

    this.imgUrl = [
      '../../assets/p1.jpg',
      '../../assets/p2.jpg',
      '../../assets/p3.jpg',
      '../../assets/p4.jpg',
      '../../assets/p5.jpg',
      '../../assets/p6.jpg'
    ];
  }

}


