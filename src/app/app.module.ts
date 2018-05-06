import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//PAGES
import { LoginPage, HomePage, CapturaPage, ListaPage, TabsPage } from '../pages/indexPaginas';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//PROVIDER
import { CargarArchivoProvider } from '../providers/cargar-archivo/cargar-archivo';
//FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
//Configuración de firebase
export const firebaseConfig = {
  apiKey: "AIzaSyAPp8tNEs6sIMmeiSOulXIhTE4de-1kQT4",
  authDomain: "relevamientovisual-33c9c.firebaseapp.com",
  databaseURL: "https://relevamientovisual-33c9c.firebaseio.com",
  projectId: "relevamientovisual-33c9c",
  storageBucket: "relevamientovisual-33c9c.appspot.com",
  messagingSenderId: "863876774939"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    CapturaPage,
    ListaPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Volver',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    CapturaPage,
    ListaPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    CargarArchivoProvider
  ]
})
export class AppModule {}
