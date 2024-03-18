import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsComponent } from './product-details.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductDetailsComponent,
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            },
            queryParams: of({}),
            params: of({})
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set product details on init', () => {
    const mockProduct = {
      id: 1,
      productName: 'Test Product',
      brandName: 'Test Brand',
      quantity: [1, 2, 3],
      pricePerUnit: 10,
      selectedQuantity: 1,
      productCount: { '1': 1 },
      price: 10
    };

    component.product = mockProduct;
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockProduct));

    component.ngOnInit();
    expect(component.product.id).toBe(mockProduct.id);
    expect(component.selectedQuantities[mockProduct.id]).toBe(mockProduct.selectedQuantity);
  });


  it('should update selectedQuantities and product price on selection change', () => {
    const mockProduct = {
      id: 1,
      productName: 'Test Product',
      brandName: 'Test Brand',
      quantity: [1, 2, 3],
      pricePerUnit: 10,
      selectedQuantity: 1,
      productCount: { '1': 1 },
      price: 10
    };

    component.product = mockProduct;

    component.onSelectionChange({ value: 2 }, mockProduct);

    expect(mockProduct.selectedQuantity).toBe(2);
    expect(mockProduct.price).toBe(20);
  });

  it('should add product to cart and update local storage', () => {
    const mockProduct = {
      id: 1,
      productName: 'Test Product',
      brandName: 'Test Brand',
      quantity: [1, 2, 3],
      pricePerUnit: 10,
      selectedQuantity: 1,
      productCount: { '1': 1 },
      price: 10
    };

    component.product = mockProduct;
    spyOn(localStorage, 'setItem').and.stub();
    component.addToCart(mockProduct);
    expect(component.productCount[mockProduct.id]).toBe(1);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should decrement product count and update local storage', () => {
    const mockProduct = {
      id: 1,
      productName: 'Test Product',
      brandName: 'Test Brand',
      quantity: [1, 2, 3],
      pricePerUnit: 10,
      selectedQuantity: 1,
      productCount: { '1': 2 },
      price: 20
    };

    component.product = mockProduct;
    spyOn(localStorage, 'setItem').and.stub();
    component.decrementCount(mockProduct);
    expect(mockProduct.productCount['1']).toBe(2);
  });


  it('should increment product count and update local storage', () => {
    const mockProduct = {
      id: 1,
      productName: 'Test Product',
      brandName: 'Test Brand',
      quantity: [1, 2, 3],
      pricePerUnit: 10,
      selectedQuantity: 1,
      productCount: { '1': 0 },
      price: 10
    };

    component.product = mockProduct;
    spyOn(localStorage, 'setItem').and.stub();
    component.incrementCount(mockProduct);
    expect(component.productCount[mockProduct.id.toString()]).toBe(1);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should update local storage on selection change', () => {
    const mockProduct = {
      id: 1,
      productName: 'Test Product',
      brandName: 'Test Brand',
      quantity: [1, 2, 3],
      pricePerUnit: 10,
      selectedQuantity: 1,
      productCount: { '1': 1 },
      price: 10
    };

    component.product = mockProduct;
    spyOn(localStorage, 'setItem').and.stub();

    component.onSelectionChange({ value: 2 }, mockProduct);
    expect(component.product.selectedQuantity).toBe(2);
    expect(component.product.price).toBe(20);
    expect(localStorage.setItem).toHaveBeenCalled();
  });


  it('should clear local storage on destroy', () => {
    spyOn(localStorage, 'removeItem').and.stub();
    component.ngOnDestroy();
    expect(localStorage.removeItem).toHaveBeenCalled();
  });
});
