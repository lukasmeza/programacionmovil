import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
// import { Usuario } from 'src/app/model/Usuario';

import { DBTaskService } from '../../services/dbtask/dbtask.service';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  login: any={
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Usuario:'',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Password:''
  };

  field='';

  // public usuario: Usuario;

  constructor(private router: Router,
    public  toastController: ToastController,
    public dbtaskService: DBTaskService,
    public alertController: AlertController,
    private storage: Storage,
    public authenticationService: AuthenticationService) {
    // this.usuario = new Usuario();
    // this.usuario.nombreUsuario = '';
    // this.usuario.password = '';
  }

  public ngOnInit(): void {}

  public ingresar(): void {
    // if (!this.validarUsuario(this.usuario)) {
    //   return;
    // }

    if(this.validateModel(this.login)){
      this.authenticationService.login(this.login);
    }
    else{
      this.presentToast('Falta: ' + this.field);
    }

    // this.mostrarMensaje('¡Bienvenido!');
    // const navigationExtras: NavigationExtras = {
    //   state: {
    //     usuario: this.usuario
    //   },
    // };
    // this.router.navigate(['/home'], navigationExtras);
  }

  registrar(){
    this.createSessionData(this.login);
  }
  // public validarUsuario(usuario: Usuario): boolean {
  //   const mensajeError = usuario.validarUsuario();

  //   if (mensajeError) {
  //     this.mostrarMensaje(mensajeError);
  //     return false;
  //   }

  //   return true;
  // }

  createSessionData(login: any){
    if(this.validateModel(login)){

      // eslint-disable-next-line prefer-const
      let copy = Object.assign({}, login);
      copy.Active=1;

      this.dbtaskService.createSessionData(copy).then((data)=>{
        this.presentToast('Bienvenido!');
        this.storage.set('USER_DATA',data);
        this.router.navigate(['home']);
      }).catch((error)=>{
        this.presentToast('El usuario ya existe');
      });
    }
    else {
      this.presentToast('Falta: '+this.field);
    }
  }

  validateModel(model: any){

    // eslint-disable-next-line no-var
    for (var [key, value] of Object.entries(model)) {

      // eslint-disable-next-line eqeqeq
      if(value=='') {
        this.field=key;
        return false;
      }
    }

    return true;
  }

  async presentToast(message: string, duration?: number){
    const toast = await this.toastController.create(
      {
        message,
        duration:duration?duration:2000
      }
    );
    toast.present();
  }

//   async mostrarMensaje(mensaje: string, duration?: number) {
//     const toast = await this.toastController.create({
//       message: mensaje,
//       duration: duration ? duration : 2000,
//     });
//     toast.present();
//   }

  ionViewWillEnter(){
    console.log('ionViewDidEnter');

    this.dbtaskService.sessionActive().then((data)=>{
      // eslint-disable-next-line eqeqeq
      if(data!=undefined){
        this.storage.set('USER_DATA',data);
        this.router.navigate(['login']);
      }
    }).catch((error)=>{
      console.error(error);
      this.router.navigate(['login']);
    });
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Creación de Usuario',
      message: 'Mensaje <strong>Este Usuario no existe, desea registrar un nuevo Usuario?</strong>',
      buttons: [
        {
          text: 'NO',
          role: 'cancel'
        }, {
          text: 'SI',
          handler: () => {
            this.createSessionData(this.login);
          }
        }
      ]
    });

    await alert.present();

  }

 }
