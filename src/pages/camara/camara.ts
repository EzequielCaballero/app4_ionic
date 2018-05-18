import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage, CapturaPage } from '../indexPaginas';
//*********************CAMARA PLUGIN***********************//
import { Camera, CameraOptions } from '@ionic-native/camera';
//******************PROVIDER********************//
import { CargarArchivoProvider } from "../../providers/cargar-archivo/cargar-archivo";

@Component({
  selector: 'page-camara',
  templateUrl: 'camara.html',
})
export class CamaraPage {

  tematicaElegida:string;
  titulo:string = "";
  listImagenPreview:string[] = [];
  imagenesParaSubir:string[] = [];
  maximaCarga:boolean = false;
  mostrarSpinner:boolean = false;
  counter:number = 0;
  audio = new Audio();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public camera: Camera,
              public _cargarArchivo: CargarArchivoProvider) {

        this.tematicaElegida = this.navParams.get('opcion');
        console.log("Temática elegida: " + this.tematicaElegida);
  }

  ionViewWillEnter() {
    this.mostrarSpinner = true;
    this._cargarArchivo.iniciar_lectura().then(()=>{
        this.mostrarSpinner = false;
    }).catch(()=>{
        console.log("Error al cargar imagenes");
    });
  }

  //*******************METODO CAMARA*******************//
  mostrar_camara(){

    //Configuración de la camara
    const options: CameraOptions = {
      quality: 35,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    //Implementación y almacenado de la imagen tomada en base64
      if(this.counter <= 2){
        this.camera.getPicture(options).then((imageData) => {
            this.listImagenPreview[this.counter] = 'data:image/jpeg;base64,' + imageData;
            this.imagenesParaSubir[this.counter] = imageData;
            this.reproducirSonido("imagenCargada");
            this.counter++;
            if(this.counter == 3)
              this.maximaCarga = true;
      }, (err) => {
          let currentDate = new Date();
          console.log("Fecha generada: " + currentDate);
          let fecha:string = currentDate.getDate()+'/'+(currentDate.getMonth() + 1)+'/'+currentDate.getFullYear();
          console.log("Fecha: " + fecha);
          let hora:string = currentDate.getHours().toString()+':'+ (currentDate.getMinutes()<10?'0':'').toString() +currentDate.getMinutes().toString();
          console.log("Hora: " + hora);
          console.info("ERROR EN LA CAMARA", JSON.stringify(err));
      });
    }//FIN IF contador
  }

  //SUBIR IMAGENES A FIREBASE
  crear_post(){
    this.mostrarSpinner = true;
    //La variable "archivo" debe cumplir con la interface declarada
    let archivo = {
      img: this.imagenesParaSubir,
      titulo: this.titulo,
      tematica: this.tematicaElegida
    }
    console.log("Imagenes por subir: " + JSON.stringify(this.imagenesParaSubir));
    //Cargar imagenes al storage+database
    this._cargarArchivo.cargar_imagen_storage(archivo).then((resultado)=>{
      console.log("Todo OK");
      this.mostrarSpinner = false;
      this._cargarArchivo.imagenes = [];
      this._cargarArchivo.desuscribir();
      this.reproducirSonido("todoOk");
      this.navCtrl.push(HomePage);
    });
  }

  reproducirSonido(tipoSonido:string){
    if(tipoSonido == "todoOk"){
      this.audio.src = "assets/sounds/notice_1.mp3";
    }
    if(tipoSonido == "imagenCargada"){
      this.audio.src = "assets/sounds/reload_shotgun.mp3";
    }
    if(tipoSonido == "error"){
      this.audio.src = "assets/sounds/windows_xp_error.mp3";
    }
    this.audio.load();
    this.audio.play();
  }

  volver(){
    this._cargarArchivo.desuscribir();
    this.navCtrl.push(CapturaPage);
  }

}
