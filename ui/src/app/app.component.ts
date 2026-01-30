import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PresetListComponent } from './components/preset-list-component/preset-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PresetListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ui';
}
