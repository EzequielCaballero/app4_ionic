import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { timer } from 'rxjs/observable/timer';
//PAGINA
import { HomePage } from '../home/home';
//MANEJO DE DATOS
import { USUARIOS } from "../../data/data_usuarios"; // FUENTE
import { Usuario } from "../../interfaces/usuario_interface"; //FORMATO
//jQUERY
import * as $ from 'jquery';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //ATRIBUTOS
  myLoginForm:FormGroup;
  flag:boolean = false;
  focus1:boolean = false;
  focus2:boolean = false;
  mostrarSpinner:boolean = false;
  mostrarIngreso:boolean = false;
  usuarios:Usuario[] = [];
  userNameTxt:string;
  userPassTxt:number;
  emailFormat:string = '^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i';
  audio = new Audio();
  //CONSTRUCTOR
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public fbLogin:FormBuilder) {

    this.userNameTxt = "";
    this.userPassTxt = null;
    this.usuarios = USUARIOS.slice(0);
    this.myLoginForm = this.fbLogin.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required]],
    });
  }

  //METODOS
  activarInicio(){
    timer(500).subscribe(()=> {
      $('.submitPanel').addClass('animated fadeOut');
    });
    timer(1000).subscribe(()=> {
      $('#cajaLogueo').addClass('animated fadeIn');
      this.mostrarIngreso = true;
    });
  }

  perdioFoco(input:number){
    $('.botonesLogueo').removeClass('animated flash');
    switch(input)
    {
      case 1:
      this.focus1 = false;
      console.log("Perdio foco 1!");
      break;
      case 2:
      this.focus2 = false;
      console.log("Perdio foco 2!");
      break;
    }
  }

  tieneFoco(input:number){
    $('.botonesLogueo').addClass('animated flash');
    switch(input)
    {
      case 1:
      this.focus1 = true;
      console.log("Tiene foco 1!");
      break;
      case 2:
      this.focus2 = true;
      console.log("Tiene foco 2!");
      break;
    }
  }
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
      this.reproducirSonido();
      this.mostrarAlerta();
    }
  }

  ingresar(usuario:any){
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
  reproducirSonido(){
    this.audio.src = "assets/sounds/windows_xp_error.mp3";
    this.audio.load();
    this.audio.play();
  }
}
