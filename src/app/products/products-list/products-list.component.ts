import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products: any;
  productCount: { [key: string]: number } = {};

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data.products;
    });
  }

  navigateToProductDetails(event: Event, productId: number) {
    event.preventDefault();
    this.router.navigate(['/product-details', productId]);
  }

  addToCart(product: any): void {
    if (this.productCount[product.id] === undefined) {
      this.productCount[product.id] = 1;
    } else {
      this.productCount[product.id]++;
    }
  }

  decrementCount(product: any): void {
    if (this.productCount[product.id] !== undefined && this.productCount[product.id] > 0) {
      this.productCount[product.id]--;
    }
  }

  incrementCount(product: any): void {
    if (this.productCount[product.id] === undefined) {
      this.productCount[product.id] = 1;
    } else {
      this.productCount[product.id]++;
    }
  }
}