import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RegisterComponent } from '../register-user/register-user.component';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, RegisterComponent, DialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  visible: boolean = false;

  showDialog(): void {
    this.visible = true;
  }

}
