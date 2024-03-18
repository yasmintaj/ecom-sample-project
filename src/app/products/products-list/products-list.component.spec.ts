import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../shared/services/product.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    productService = jasmine.createSpyObj('ProductService', ['getProducts']);

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [{ provide: ProductService, useValue: productService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize products on ngOnInit', () => {
    const mockData = {
      Products: [
        {
          ProductID: 1,
          Name: 'Product 1',
          BrandID: 1,
          CategoryID: 1,
          Quantities: [1, 2, 3],
          PricePerUnit: 10,
          rating: 4,
          ImageURL: 'image-url',
          UnitType: 'kg'
        }
      ],
      Categories: [{ CategoryID: 1, Brands: [{ BrandID: 1, Name: 'Brand 1' }] }]
    };

    productService.getProducts.and.returnValue(of(mockData));

    fixture.detectChanges();

    expect(component.products).toBeDefined();
    expect(component.products.length).toBe(1);
    expect(component.products[0].id).toBe(1);
  });

  it('should set selectedQuantities on ngOnInit', () => {
    const mockData = {
      Products: [
        { ProductID: 1, Quantities: [1, 2, 3] },
        { ProductID: 2, Quantities: [4, 5, 6] }
      ],
      Categories: []
    };

    productService.getProducts.and.returnValue(of(mockData));

    fixture.detectChanges();

    const actualSelectedQuantitiesAsString: { [key: string]: string } = {};
    for (const key in component.selectedQuantities) {
      if (component.selectedQuantities.hasOwnProperty(key)) {
        actualSelectedQuantitiesAsString[key] = component.selectedQuantities[key].toString();
      }
    }

    const expectedSelectedQuantities: { [key: string]: string } = { '1': '1', '2': '4' };
    expect(actualSelectedQuantitiesAsString).toEqual(expectedSelectedQuantities);
  });



  it('should update selectedQuantities onSelectionChange', () => {
    const product = { id: 1 };
    component.selectedQuantities = { '1': '1' };

    component.onSelectionChange({ value: '2' }, product);

    expect(component.selectedQuantities['1']).toBe('2');
  });


  it('should navigate to product details', () => {
    const product = { id: 1 };
    navigateSpy = spyOn(component['router'], 'navigate');

    component.navigateToProductDetails(new Event('click'), product);

    expect(navigateSpy).toHaveBeenCalledWith(['/product-details', 1], { state: { product } });
  });

  it('should add product to cart', () => {
    component.productCount = {};
    const product = { id: 1 };

    component.addToCart(product);

    expect(component.productCount[1]).toBe(1);
  });

  it('should decrement product count', () => {
    component.productCount = { 1: 2 };

    component.decrementCount({ id: 1 });

    expect(component.productCount[1]).toBe(1);
  });

  it('should increment product count', () => {
    component.productCount = { 1: 2 };

    component.incrementCount({ id: 1 });

    expect(component.productCount[1]).toBe(3);
  });
});
