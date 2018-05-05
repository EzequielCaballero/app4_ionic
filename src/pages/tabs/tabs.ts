import { Component } from '@angular/core';
import { HomePage, CapturaPage, ListaPage } from '../indexPaginas';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CapturaPage;
  tab3Root = ListaPage;

  constructor() {

  }
}
