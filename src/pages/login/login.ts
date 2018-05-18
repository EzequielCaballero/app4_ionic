import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { timer } from 'rxjs/observable/timer';
//PAGINA
import { HomePage } from '../indexPaginas';

//FIREBASE
import { AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import{ Observable } from 'rxjs/Observable';
//jQUERY
import * as $ from 'jquery';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //ATRIBUTOS
  perfil:string = "";
  userActive:any;
  myLoginForm:FormGroup;
  flag:boolean = false;
  focus1:boolean = false;
  focus2:boolean = false;
  mostrarSpinner:boolean = false;
  mostrarIngreso:boolean = false;
  userNameTxt:string;
  userPassTxt:string;
  emailFormat:string = '^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i';
  audio = new Audio();
  user: Observable<firebase.User>;
  //CONSTRUCTOR
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public fbLogin:FormBuilder,
              private afAuth:AngularFireAuth) {

    this.user = this.afAuth.authState;
    console.log("Sesion activa?: " + this.afAuth.auth.currentUser);
    this.userNameTxt = "";
    this.userPassTxt = "";
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
    this.mostrarSpinner = true;
    this.afAuth
      .auth
      .signInWithEmailAndPassword(this.myLoginForm.value.userEmail, this.myLoginForm.value.userPassword)
      .then(value => {
        console.log('Funciona!' + JSON.stringify(value));
        switch(this.afAuth.auth.currentUser.uid)
        {
          case "oH9eyTlmM6d3vshHf2XjN1E1VjG3": this.perfil = "Administrador";
          break;
          case "VWgqQZ3XI6bOUMQDJkvmShqKe3s2":
          case "VeXKdJ2j5xMkeO6Ixnjo3b347xi2": this.perfil = "Usuario";
          break;
          case "c5Q4Lpo3NuXkqpmWMcodAfsczxN2": this.perfil = "Invitado";
          break;
          case "sIzJqRlfOUMqz3zLMmnSoPyNdzk2": this.perfil = "Tester";
          break;
        }
          this.ingresar();
        //this.ingresar(value);
      })
      .catch(err => {
        console.log('Algo salió mal: ',err.message);
        this.reproducirSonido("error");
        this.mostrarSpinner = false;
        this.mostrarAlerta();
      });
  }

  ingresar(){
    this.userActive = firebase.auth().currentUser;
    this.userActive.updateProfile({
      displayName: this.perfil,
      //photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(value => {
      // Update successful.
      this.mostrarSpinner = false;
      this.reproducirSonido("todoOk");
      this.navCtrl.push(HomePage);
    })
    .catch(err => {
      console.log('Algo salió mal: ',err.message);
      this.reproducirSonido("error");
    });
  }

  ingresoDePrueba(user:string){
    switch(user){
      case 'admin':
        this.userNameTxt = "admin@gmail.com";
        this.userPassTxt = "admin11";
        break;
      case 'user':
        this.userNameTxt = "usuario@gmail.com";
        this.userPassTxt = "user33";
        break;
      case 'invited':
        this.userNameTxt = "invitado@gmail.com";
        this.userPassTxt = "invitado22";
        break;
      case 'tester':
        this.userNameTxt = "tester@gmail.com";
        this.userPassTxt = "tester55";
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
  reproducirSonido(tipoSonido:string){
    if(tipoSonido == "todoOk"){
      this.audio.src = "assets/sounds/camera_click.mp3";
      this.audio.load();
      this.audio.play();
    }
    if(tipoSonido == "error"){
      this.audio.src = "assets/sounds/windows_xp_error.mp3";
      this.audio.load();
      this.audio.play();
    }
  }
}
