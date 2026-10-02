// A generation token prevents a cancelled or already queued callback from
// changing a newly restarted game, even if a timer races with cancellation.
export class TurnClock {
  constructor(set=(cb,delay)=>setTimeout(cb,delay),clear=id=>clearTimeout(id)){this.set=set;this.clear=clear;this.generation=0;this.timer=null;}
  cancel(){this.generation++;if(this.timer!==null)this.clear(this.timer);this.timer=null;}
  schedule(callback,delay){this.cancel();const generation=this.generation;this.timer=this.set(()=>{if(generation!==this.generation)return;this.timer=null;callback();},delay);}
}
