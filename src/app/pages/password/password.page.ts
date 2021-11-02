import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Validators, FormControl, FormBuilder, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  RegisterForm: FormGroup;

  valuefromuser: any;

  constructor(
    private alertCtrl: AlertController
  ) { }
  submit(){
    console.log('value is = ', this.valuefromuser);
  }



  async ingresar(){
    await this.alertCtrl.create({
      header: 'Recuperación de contraseña enviada correctamente.',
      message: 'Esto podría tardar unos minutos.',
      buttons: [
        { text: 'aceptar', handler: (res) => {
          console.log(res.promo);
        }
      }
      ]
    }).then( res => res.present());
  }
}
