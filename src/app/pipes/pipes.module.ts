import { NgModule } from '@angular/core';
import { RoundPipe } from './round/round.pipe';

@NgModule({
  declarations: [RoundPipe],
  exports: [RoundPipe]
})
export class PipesModule { }
