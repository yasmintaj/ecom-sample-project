import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'

})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  selectedQuantities: { [key: string]: number } = {};
  productCount: { [key: string]: number } = {};

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const storedProduct = localStorage.getItem('currentProduct');
    if (storedProduct) {
      this.product = JSON.parse(storedProduct);
    } else {
      this.product = history.state && history.state.product ? history.state.product : {};
    }
    this.selectedQuantities[this.product.id] = this.product.selectedQuantity;
    this.productCount[this.product.id] = this.product.productCount ? this.product.productCount[this.product.id] : 0;
  }

  ngOnDestroy(): void {
    this.clearLocalStorage();
  }

  onSelectionChange(event: any, product: any) {
    product.selectedQuantity = event.value;
    product.price = product.pricePerUnit * product.selectedQuantity;
    this.updateLocalStorage();
  }

  addToCart(product: any): void {
    if (this.productCount[product.id] === undefined) {
      this.productCount[product.id] = 1;
    } else {
      this.productCount[product.id]++;
    }
    product.productCount[product.id] = this.productCount[product.id];
    this.updateLocalStorage();
  }

  decrementCount(product: any): void {
    if (this.productCount[product.id] !== undefined && this.productCount[product.id] > 0) {
      this.productCount[product.id]--;
      product.productCount[product.id] = this.productCount[product.id];
      this.updateLocalStorage();
    }
  }

  incrementCount(product: any): void {
    if (this.productCount[product.id] === undefined) {
      this.productCount[product.id] = 1;
    } else {
      this.productCount[product.id]++;
    }
    product.productCount[product.id] = this.productCount[product.id];
    this.updateLocalStorage();
  }

  updateLocalStorage(): void {
    localStorage.setItem('currentProduct', JSON.stringify(this.product));
  }

  clearLocalStorage(): void {
    localStorage.removeItem('currentProduct');
  }
}