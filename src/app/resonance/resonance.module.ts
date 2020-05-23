import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PipesModule } from '../pipes/pipes.module';
import { ResonanceRoutingModule } from './resonance-routing.module';
import { ResonanceComponent } from './resonance.component';

@NgModule({
  declarations: [ResonanceComponent],
  imports: [
    CommonModule,
    ResonanceRoutingModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    PipesModule
  ]
})
export class ResonanceModule { }
