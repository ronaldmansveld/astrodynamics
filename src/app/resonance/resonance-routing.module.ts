import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResonanceComponent } from './resonance.component';

const routes: Routes = [{ path: '', component: ResonanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResonanceRoutingModule { }
