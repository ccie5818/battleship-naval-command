import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base='https://ccie5818.github.io/battleship-naval-command/';
const files=['index.html','style.css','app.js','engine.js','turn-clock.js','README.md','BUGS.md','package.json'];
const sha=execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
for(const file of files){
  const expected=execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'show',`HEAD:${file}`]);
  const response=await fetch(`${base}${file}?verify=${sha}`,{cache:'no-store'});
  assert.equal(response.status,200,`${file} response`);
  const actual=Buffer.from(await response.arrayBuffer());
  const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
  assert.equal(hash(actual),hash(expected),`${file} deployed bytes differ from HEAD`);
  console.log(`MATCH ${file} ${hash(actual).slice(0,12)}`);
}
console.log(`Verified deployed files exactly match commit ${sha}`);
