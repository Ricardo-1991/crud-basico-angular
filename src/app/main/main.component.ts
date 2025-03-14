import { Component } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpClientUserService } from '../service/http-client.user';
import {HttpClientZipCodeService} from '../service/http-client.zipcode';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  imports: [TableModule, ButtonModule, DialogModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  users: any[] = [];
  visible: boolean = false
  userForm!: FormGroup
  editedUser: any = {}
  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'completeName', header: 'Nome' },
    { field: 'lastName', header: 'Sobrenome' },
    { field: 'email', header: 'Email' },
    { field: 'birthDate', header: 'Data de Nascimento' },
    { field: 'zipCode', header: 'CEP' },
    { field: 'country', header: 'País' },
    { field: 'city', header: 'Cidade' },
    { field: 'neighborhood', header: 'localidade' },
  ];
  constructor(private httpClientUserService: HttpClientUserService, private httpClienteZipCodeService: HttpClientZipCodeService){}

  ngOnInit(){
    this.userForm = new FormGroup({
      zipCode: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      neighborhood: new FormControl('', Validators.required),
    })
    this.httpClientUserService.loadUsers();
    this.httpClientUserService.getUsers().subscribe({
      next: (data) =>  this.users = data,
      error: (error) => console.log("Error ao buscar usuários", error)
    })
    console.log(this.users)
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

  showDialog(user: any): void {
      this.editedUser = { ...user };
      this.userForm.patchValue({
        zipCode: user.zipCode,
      });
    this.visible = true;
  }

  deleteUser(id: any){
    this.httpClientUserService.deleteUser(id).subscribe({
      next: () => this.ngOnInit(),
      error: (error) => console.log("Error ao deletar usuário", error)
    })
  }

  onUpdateUser(): void {
    const updatedUser = { ...this.editedUser, ...this.userForm.value };
    this.httpClientUserService.updateUser(updatedUser.id, updatedUser).subscribe({
      next: () => {
        this.httpClientUserService.loadUsers();
        this.visible = false;
      },
      error: (error) => console.log('Error ao atualizar usuário', error)
    });
    this.userForm.reset();
  }
}
