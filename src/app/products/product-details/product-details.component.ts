import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})

export class ProductDetailsComponent implements OnInit {
  productId!: number;
  product: any;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.productId = +id;
        this.getProductDetails();
      } else {
      }
    });
  }

  getProductDetails(): void {
    if (this.productId !== null) {
      this.productService.getProductById(this.productId).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
        },
        complete: () => {
          console.info('Product details fetched successfully');
        }
      });
    } else {
      console.error('Product ID is null');
    }
  }
}
