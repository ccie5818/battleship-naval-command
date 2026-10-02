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
  for(const length of FLEET) { while(!place(b,Math.floor(rng()*100),length,rng()<.5)) {} }
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
  constructor(rng=Math.random){this.rng=rng;this.tried=new Set();}
  next(){const options=Array.from({length:100},(_,i)=>i).filter(c=>!this.tried.has(c));const cell=options[Math.floor(this.rng()*options.length)];this.tried.add(cell);return cell;}
  observe(result){}
}
