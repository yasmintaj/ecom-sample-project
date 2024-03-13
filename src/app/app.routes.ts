import { Routes } from '@angular/router';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './products/cart/cart.component';

export const routes: Routes = [
    { path: "", redirectTo: "products-list", pathMatch: "full" },
    { path: "products-list", component: ProductsListComponent },
    { path: "product-details/:id", component: ProductDetailsComponent },
    { path: "cart", component: CartComponent },
];
