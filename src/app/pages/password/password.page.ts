import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';


import { Validators, FormControl, FormBuilder, FormGroup} from '@angular/forms';
import { Usuario } from 'src/app/model/Usuario';
@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
  public usuario: Usuario;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  RegisterForm: FormGroup;

  valueUser: any;

  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private toastController: ToastController
  )
  {
    this.usuario = new Usuario();
    this.usuario.email = '';
   }
  ngOnInit(): void {}

  public ingresar(): void {
    if (!this.validarEmail(this.usuario)) {
      return;
    }

    this.ingresar2();

    this.mostrarMensaje('');

    const navigationExtras: NavigationExtras = {
      state: {
        email: this.usuario
      },
    };
  }
  public validarEmail(email: Usuario): boolean {
    const mensajeError = email.validarEmail();

    if (mensajeError) {
      this.mostrarMensaje(mensajeError);
      return false;
    }

    return true;
  }

  /**
   * Muestra un toast al usuario
   *
   * @param mensaje
   * @param duration
   */
   async mostrarMensaje(mensaje: string, duration?: number) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duration ? duration : 2000,
    });
    toast.present();
  }



  submit(){
    console.log('value is = ', this.valueUser);
  }



  async ingresar2(){
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
