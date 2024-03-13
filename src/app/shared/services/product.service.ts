import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private apiUrl = '../../../assets/mock-data/mock-products.json';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<any> {
        return this.http.get<any>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }
    getProductById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl).pipe(
            map((data: any) => {
                const products = data.products;
                const product = products.find((p: any) => p.id === id.toString());
                if (!product) {
                    throw new Error('Product not found');
                }
                return product;
            }),
            catchError(this.handleError)
        );
    }
    private handleError(error: any): Observable<any> {
        console.error('An error occurred:', error);
        throw error;
    }
}
