import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register-user/register-user.component';
import { MainComponent } from './main/main.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MainComponent,  RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-form-user';
}
