import test from 'node:test';
import assert from 'node:assert/strict';
import {board,place,fire,randomFleet,AI,FLEET} from '../engine.js';
test('placement rejects boundaries and overlaps',()=>{const b=board();assert.equal(place(b,9,2),false);assert.equal(place(b,90,2,true),false);assert.equal(place(b,0,5),true);assert.equal(place(b,3,3,true),false);});
test('random fleets have the standard inventory and 17 unique cells',()=>{for(let i=0;i<200;i++){const b=randomFleet();assert.deepEqual(b.ships.map(s=>s.length),FLEET);assert.equal(new Set(b.ships.flatMap(s=>s.cells)).size,17);}});
test('shots resolve hit, miss, sink, repeat, and victory',()=>{const b=board();FLEET.forEach((n,i)=>place(b,i*10,n));assert.equal(fire(b,99).hit,false);assert.equal(fire(b,99),null);let r;for(const s of b.ships)for(const c of s.cells)r=fire(b,c);assert.equal(r.sunk,true);assert.equal(r.win,true);assert.equal(b.shots.get(0),'sunk');});
test('random AI exhausts the board without repeated shots',()=>{const ai=new AI();const shots=Array.from({length:100},()=>ai.next());assert.equal(new Set(shots).size,100);});
