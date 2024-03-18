import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products: any;
  result: any;
  productCount: { [key: string]: number } = {};
  selectedQuantities: { [key: string]: string } = {};
  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.result = data;
      this.products = data.Products.map(this.createProductData);
      this.products.forEach((product: { id: number; quantity: string[]; }) => {
        this.selectedQuantities[product.id] = product.quantity[0];
      });
    });
  }
  createProductData = (product: any) => {
    return {
      id: product.ProductID,
      productName: product.Name,
      brandName: this.getBrandName(product.BrandID, product.CategoryID),
      quantity: product.Quantities,
      pricePerUnit: product.PricePerUnit,
      price: product.Quantities[0] * product.PricePerUnit,
      rating: product.rating,
      imageUrl: product.ImageURL,
      selectedQuantity: product.Quantities[0],
      unitType: product.UnitType,
    };
  }
  getBrandName(brandID: number, categoryID: number) {
    const category = this.result.Categories.find((cat: { CategoryID: any; }) => cat.CategoryID === categoryID);
    if (category) {
      const brand = category.Brands.find((brand: { BrandID: any; }) => brand.BrandID === brandID);
      if (brand) {
        return brand.Name;
      }
    }
    return '';
  }

  onSelectionChange(event: any, product: any) {
    this.selectedQuantities[product.id] = event.value;
    product.selectedQuantity = event.value;
    product.price = product.selectedQuantity * product.pricePerUnit;
  }

  navigateToProductDetails(event: Event, product: any) {
    event.preventDefault();
    product.productCount = this.productCount;
    this.router.navigate(['/product-details', product.id], { state: { product: product } });
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