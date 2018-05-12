import { Injectable } from '@angular/core';
//Componente: Toast
import { ToastController } from 'ionic-angular';

//*********************FIREBASE import*********************//
import { AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
//Interface de subir archivo
import { Archivo } from "../../interfaces/archivo_interface";
//Importar map: operador para transformar la información recibida de afDB.list
import 'rxjs/add/operator/map';

@Injectable()
export class CargarArchivoProvider {

  imagenes:Archivo[] = []; //Fin: subir a DB la imagen subida en Storage
  lastKey: number = null; //Fin: controlar último elemento insertado en firebase
  dataSub:any;
  dataAllSub:any;

  constructor(public toastCtrl: ToastController,
              public afDB: AngularFireDatabase,
              public afAuth:AngularFireAuth) {

      console.log('Provider inyectado...');
      //CARGA: de un grupo de imágenes de la última a la primera.
      this.dataSub = this.leer_ultima_imagen().subscribe(()=>this.leer_imagenes());
  }

  //LECTURA DE ULTIMA IMAGEN SUBIDA A FIREBASE
  private leer_ultima_imagen(){
    //Retorna un observable
    return this.afDB.list('/galeria',ref=> ref.orderByKey())
           .valueChanges()
           .map( (galeria:any) =>{ //definir 'galeria' de tipo any para que no de error.

             this.lastKey = galeria[0].key; //tomar valor de ordenación del último dato cargado
             console.info("DATOS: ", galeria);
             console.log("Ultima key: " + this.lastKey);
             this.imagenes.push(galeria[0]); // guarda en array imagenes la última img subida (por key).

           })
  }

  //LECTURA DE IMAGENES POR TANDA
  leer_imagenes(){

    let promesa = new Promise((resolve, reject)=>{

      this.dataAllSub = this.afDB.list('/galeria',
        ref=> ref.limitToLast(5)//Especifico cuantas imágenes (orden cronológico descendente) serán cargadas
                 .orderByChild('key')//Criterio de ordenación ASCENDENTE por key() -> n° de post
                 .endAt( this.lastKey )//Interrupción de la lectura al alcanzar último key.
      ).valueChanges()
       .subscribe ( (galeria:any)=>{
          galeria.pop();//Elimina la última imágen del arreglo (que ya es subida por método: cargar_ultima_imagen)

          //Si se alcanza el final de imágenes (primer imágen subida)...
          if(galeria.length == 0){
            console.log("Ya no hay más registros");
            resolve(false);
            return;
          }

          this.lastKey = galeria[0].key; //Se actualiza la ultima key.

          //Se insertan las imágenes al array "imagenes" (de la última a la primera) conforme cómo se obtuvieron de firebase
          for (let i = galeria.length-1; i >= 0; i--) {
              let imagen = galeria[i];
              this.imagenes.push(imagen);
          }
          resolve(true);//Es como decir: "puede haber más imagenes".
       })

    });

    return promesa;
  }

  cargar_imagen_storage( archivo:any ){

    //Promesa que determina un tiempo hasta que se complete la carga de la imagen
    let promesa = new Promise( (resolve, reject)=>{
      //Mensajes de interacción con el usuario...
      this.mostrar_toast("Cargando...");
      //Declaración
      let storeRef = firebase.storage().ref();
      //Tarea de Carga (creación de carpeta "img" si no existe en opción Storage de Firebase)
      let numPost:number = this.lastKey + 1;
      let uploadTask: firebase.storage.UploadTask =
        storeRef.child(`img/${ this.afAuth.auth.currentUser.uid }`)
                .putString( archivo.img, 'base64', { contentType:'image/jpeg'});

      //EJECUCION DE TAREA DE CARGA
        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{},//Saber el % de cuantos Mbs fueron subidos
            ( error )=>{
              //Manejo de error
              console.info("ERROR EN LA CARGA", JSON.stringify(error));
              this.mostrar_toast("Error"+JSON.stringify(error));
            },
            ()=>{
              //Carga exitosa, TODO bien
              console.log("Archivo subido");
              this.mostrar_toast("Carga exitosa");
              //FIN---pasar imagenes a la database, obteniendo URL generada
              let url = uploadTask.snapshot.downloadURL;
              this.cargar_imagen_database(archivo.titulo, archivo.tematica, url, numPost);
              resolve();
            }
        )
      });//FIN DE LA PROMESA

    return promesa;
  }//FIN DEL METODO

  private cargar_imagen_database(titulo: string, tematica: string, url: string, numPost: number){

      //IMPORTANTE: "galeria" es el nombre del objeto creado en la DB
      let currentDate = new Date();
      let galeria:Archivo = {
        usuario: this.afAuth.auth.currentUser.email,
        titulo: titulo,
        fecha: currentDate.getDay().toString()+'/'+currentDate.getMonth().toString()+'/'+currentDate.getFullYear().toString(),
        hora: currentDate.getHours().toString()+':'+currentDate.getMinutes().toString(),
        img: url,
        tematica: tematica,
        key: numPost //date in code
      }

      console.log(JSON.stringify(galeria));
      //this.afDB.list('/galeria').push(galeria); --------------------------- subida sin especificar key
      this.afDB.object(`/galeria/${ this.afAuth.auth.currentUser.uid }`).update(galeria); // --- subida especificando custom key

      //Asignacion del nuevo "post" al array IMAGENES
      this.imagenes.push( galeria );
  }

  desuscribir(){
    this.dataSub.unsubscribe();
    this.dataAllSub.unsubscribe();
  }

  mostrar_toast( mensaje:string ){
    this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    }).present();
  }

}
