import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DBTaskService } from '../dbtask/dbtask.service';

@Injectable({
  providedIn: 'root'
})
//clase es un servicio injectable

export class AuthenticationService {
  //generamos un objeto con valor booleano que sirva para indicar si el usuario tiene o no acceso (1 o 0)
  authState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private storage: Storage,
    public dbtaskService: DBTaskService,
    public toastController: ToastController
  )
  {
    this.isLogged();
  }


  //validamos si existe un usuario activo
  isLogged(){
    this.storage.get('USER_DATA').then((response)=>{
      console.log(response);
      if(response!=null){
        this.authState.next(true);
      }
    });
  }


  //esta función cierra la sesión y actualiza los datos de SQLite
  logout(){
    this.storage.get('USER_DATA').then((data)=>{
      data.active=0;
      this.dbtaskService.updateSessionData(data).then((response)=>{
        if(response.rowsAffected>=1){
          this.storage.remove('USER_DATA');
          this.router.navigate(['login']);
          this.authState.next(false);
        }
      })
      .catch((error)=>console.error(error));
    });
  }

  //verificamos que exista una session en login
  login(login: any){
    this.dbtaskService.getSessionData(login).then((data)=>{
      //en caso de que data sea undefined es porque no retorno credenciales correctas
      //lo cual indicamos con un toast
      if(data===undefined){
        this.presentToast('Credenciales Incorrectas');
      }else{
        //ponemos el active de los datos como 1 (boolean true)
        data.active=1;
        //actualizamos la sesión de usuario
        this.dbtaskService.updateSessionData(data).then((response)=>{
          //guardamos los datos de USER_DATA
          this.storage.set('USER_DATA', data);
          //ponemos authState como TRUE
          this.authState.next(true);
          //se navega a la pagina home
          this.router.navigate(['home']);
        });
      }
    })
    //capturamos cualquier error que ocurra durante la función
    .catch((error)=>{
      console.log(error);
    });
  }

  //Presenta el mensaje de error llamado desde otras funciones
  async presentToast(message: string, duration?: number){
    const toast = await this.toastController.create(
      {
        message,
        duration:duration?duration:2000
      }
    );
    toast.present();
  }

  //manda un return con el valor de authState, si el usuario tiene las credenciales para acceder o no
  isAuthenticated(){
    return this.authState.value;
  }

}
