import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Comment, Product, ProductService} from '../shared/product.service';
import {WebsocketService} from '../shared/websocket.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  isWatched: boolean = false;
  currentBid: number;
  product: Product;
  imgUrl: Array<string>;
  comments: Comment[];
  newRating = 5;
  newComment = '';
  isCommentHidden = true;

  subscription: Subscription;

  constructor(private routeInfo: ActivatedRoute,
              private productService: ProductService,
              private wsService: WebsocketService) {
  }

  ngOnInit() {
    this.routeInfo.queryParams.subscribe((productInfo) => {
      const productId: number = productInfo.prodId;
      this.productService.getProduct(productId).subscribe(
        product => {
          this.product = product;
          this.currentBid = product.price;
        }
      );
      this.productService.getCommentsForProductId(productId).subscribe(
        comments => this.comments = comments
      );
      this.imgUrl = this.productService.getImgUrlForProductId(productId);
    });
  }

  addComment() {
    this.comments.unshift(new Comment(0, this.product.id, new Date().toLocaleString(),
      'someone', this.newRating, this.newComment));

    let sum = this.comments.reduce((sum, comment) => sum + comment.rating, 0);
    this.product.rating = sum / this.comments.length;

    this.newComment = null;
    this.newRating = 5;
    this.isCommentHidden = true;
  }

  watchProduct() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isWatched = false;
      this.subscription = null;
    } else {
      this.isWatched = true;
      this.subscription = this.wsService.createObservableSocket('ws://localhost:8085', this.product.id)
        .subscribe(
          products => {
            let productsObj = JSON.parse(products);
            let product = productsObj.find(p => p.productId === this.product.id);
            this.currentBid = product.bid;
          }
        );
    }
  }
}
