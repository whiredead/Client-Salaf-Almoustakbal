import { Component } from '@angular/core';
import { Customer } from '../../api/customer';
import { CustomerService } from '../../service/customer.service';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.scss',
  providers:[ProductService]
})
export class AcceuilComponent {
  customers!: Customer[];
  
  constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => (this.customers = customers));
    }
}
