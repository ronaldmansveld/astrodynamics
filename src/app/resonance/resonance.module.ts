import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResonanceRoutingModule } from './resonance-routing.module';
import { ResonanceComponent } from './resonance.component';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [ResonanceComponent],
  imports: [
    CommonModule,
    ResonanceRoutingModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ResonanceModule { }
