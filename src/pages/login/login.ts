import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
//PAGINA
import { HomePage } from '../home/home';
//MANEJO DE DATOS
import { USUARIOS } from "../../data/data_usuarios"; // FUENTE
import { Usuario } from "../../interfaces/usuario_interface"; //FORMATO

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //ATRIBUTOS
  myLoginForm:FormGroup;
  flag:boolean = false;
  usuarios:Usuario[] = [];
  userNameTxt:string;
  userPassTxt:number;
  emailFormat:string = '^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i';

  //CONSTRUCTOR
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public fbLogin:FormBuilder) {
    this.usuarios = USUARIOS.slice(0);
    this.myLoginForm = this.fbLogin.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    });
  }

  //METODOS
  validarUsuario(){
    this.flag = false;
    console.log("Validando usuario...");
    console.info(this.usuarios);
    for(let user of this.usuarios){
      if(this.myLoginForm.value.userEmail == user.nombre && this.myLoginForm.value.userPassword == user.clave)
      {
        this.ingresar(user);
        this.flag = true;
        break;
      }
    }
    if(!this.flag){
      console.log("El usuario no existe!");
      this.mostrarAlerta();
    }
  }

  ingresar(usuario:any){
    this.userNameTxt = "";
    this.userPassTxt = null;
    this.navCtrl.push(HomePage, {'userData': usuario});
  }

  ingresoDePrueba(user:string){
    switch(user){
      case 'admin':
        this.userNameTxt = "admin@gmail.com";
        this.userPassTxt = 11;
        break;
      case 'user':
        this.userNameTxt = "usuario@gmail.com";
        this.userPassTxt = 33;
        break;
      case 'invited':
        this.userNameTxt = "invitado@gmail.com";
        this.userPassTxt = 22;
        break;
      case 'tester':
        this.userNameTxt = "tester@gmail.com";
        this.userPassTxt = 55;
        break;
    }
  }

  mostrarAlerta(){
    let toast = this.toastCtrl.create({
      message: 'Usuario y/o contraseña incorrectos!',
      duration: 2000,
      position: "top"
    });
    toast.present();
  }

}
