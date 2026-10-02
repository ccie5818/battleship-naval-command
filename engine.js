export const FLEET = [5,4,3,3,2];
export const NAMES = ['Carrier','Battleship','Cruiser','Submarine','Destroyer'];
export const board = () => ({ships:[], shots:new Map()});
export function cellsAt(start,length,vertical=false) {
  if (!Number.isInteger(start) || start<0 || start>99) return null;
  const cells=Array.from({length},(_,i)=>start+i*(vertical?10:1));
  return cells.some(c=>c>99 || (!vertical && Math.floor(c/10)!==Math.floor(start/10)))?null:cells;
}
export function place(b,start,length,vertical=false) {
  const cells=cellsAt(start,length,vertical);
  if(!cells || b.ships.some(s=>s.cells.some(c=>cells.includes(c)))) return false;
  b.ships.push({cells,length}); return true;
}
export function randomFleet(rng=Math.random) {
  const b=board();
  for(const [fleetId,length] of FLEET.entries()) { while(!place(b,Math.floor(rng()*100),length,rng()<.5)) {} b.ships.at(-1).fleetId=fleetId; }
  return b;
}
export function fire(b,cell) {
  if(!Number.isInteger(cell)||cell<0||cell>99||b.shots.has(cell)) return null;
  const ship=b.ships.find(s=>s.cells.includes(cell));
  b.shots.set(cell,ship?'hit':'miss');
  const sunk=!!ship && ship.cells.every(c=>b.shots.has(c));
  if(sunk) ship.cells.forEach(c=>b.shots.set(c,'sunk'));
  return {cell,hit:!!ship,sunk,sunkCells:sunk?[...ship.cells]:[],win:b.ships.length===5&&b.ships.every(s=>s.cells.every(c=>b.shots.has(c)))};
}
export class AI {
  constructor(rng=Math.random){this.rng=rng;this.tried=new Set();this.hits=new Set();}
  neighbors(c){return [c-10,c+10,...(c%10?[c-1]:[]),...(c%10<9?[c+1]:[])].filter(x=>x>=0&&x<100);}
  targets(){
    const targets=[];
    for(const anchor of this.hits){
      const horizontal=this.neighbors(anchor).find(c=>this.hits.has(c)&&Math.floor(c/10)===Math.floor(anchor/10));
      const vertical=this.neighbors(anchor).find(c=>this.hits.has(c)&&c%10===anchor%10);
      if(horizontal!==undefined||vertical!==undefined){
        const step=horizontal!==undefined?1:10;
        let low=anchor,high=anchor;
        const sameLine=c=>c>=0&&c<100&&(step===10||Math.floor(c/10)===Math.floor(anchor/10));
        while(sameLine(low-step)&&this.hits.has(low-step))low-=step;
        while(sameLine(high+step)&&this.hits.has(high+step))high+=step;
        for(const c of [low-step,high+step])if(sameLine(c))targets.push(c);
      }else targets.push(...this.neighbors(anchor));
    }
    return [...new Set(targets)].filter(c=>!this.tried.has(c));
  }
  next(){
    const targets=this.targets();
    const untried=Array.from({length:100},(_,i)=>i).filter(c=>!this.tried.has(c));
    const parity=untried.filter(c=>(Math.floor(c/10)+c%10)%2===0);
    const options=targets.length?targets:parity.length?parity:untried;
    if(!options.length)return null;
    const cell=options[Math.floor(this.rng()*options.length)];this.tried.add(cell);return cell;
  }
  observe(result){
    if(!result)return;
    this.tried.add(result.cell);
    if(result.hit)this.hits.add(result.cell);
    if(result.sunk)for(const c of result.sunkCells)this.hits.delete(c);
  }
}
