import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms'
import { DatePipe} from '@angular/common';
import { NgxMaskDirective} from 'ngx-mask';

import { HttpClientZipCodeService } from '../service/http-client.zipcode';
import { HttpClientUserService } from '../service/http-client.user';

@Component({
  selector: 'app-main',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [DatePipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  userForm!: FormGroup

  constructor(private datePipe: DatePipe,
              private httpClienteZipCodeService: HttpClientZipCodeService,
              private httpClienteUserService: HttpClientUserService
  ){}

  ngOnInit(){
    this.userForm = new FormGroup({
      completeName: new FormControl('', [Validators.required, Validators.minLength(5)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required,  Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      birthDate: new FormControl('', Validators.required),
      zipCode: new FormControl('',Validators.required),
      country: new FormControl('',Validators.required),
      city: new FormControl('',Validators.required),
      neighborhood: new FormControl('',Validators.required),
    })
  }

  onCepBlur() {
    const cep = this.userForm.get('zipCode')?.value;
    if (cep) {
      this.httpClienteZipCodeService.getZipCode(cep).subscribe({
        next: response => {
          this.userForm.patchValue({
            city: response.localidade,
            neighborhood: response.bairro,
            country: 'Brasil'
          });
        },
        error: error => {
          console.error('Erro ao buscar dados do CEP', error);
        }
      });
    }
  }

  onSubmit(){
    if(this.userForm.valid){
      const formValues = this.userForm.value
      const birthDate = this.userForm.get('birthDate')?.value

      const formattedDate = this.datePipe.transform(birthDate, 'dd/MM/yyyy')

      const payload = {
        ...formValues,
        birthDate: formattedDate
      }
      this.httpClienteUserService.createUser(payload).subscribe({
        next: response => {
          console.log("Usuário criado com sucesso", response);
        },
        error: error => {
          console.error('Erro ao buscar dados do CEP', error);
        }
      })
    }
  }
}
