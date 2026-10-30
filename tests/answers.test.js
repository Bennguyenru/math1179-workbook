/* Kiểm tra: đáp án chuẩn của mọi ý đều được bộ chấm chấp nhận */
const fs=require('fs');
global.module=undefined;
const src=fs.readFileSync(require('path').join(__dirname,'../dist/bundle.js'),'utf8');
eval(src.replace(/if \(typeof module[^\n]*\n/g,''));
let fails=[],n=0;
const OVR={};
CH.forEach(ch=>ch.qs.forEach((q,qi)=>q.parts.forEach((p,pi)=>{
  if(p.t==='open')return;
  n++;
  if(p.t==='grid'){ p.rows.forEach(r=>r.forEach(c=>{ if(typeof c!=='string'){ const v=c.empty?'':c.s; const L=low(v); if(!(c.empty&&!L) && c.a.map(low).indexOf(L)<0) fails.push(`ch${ch.no} q${q.n} grid cell ${c.s}`);} })); return; }
  let inp = p.ex || ((p.t==='tf'||p.t==='choice')? p.a : (p.t==='str' && p.a && p.a.length ? p.a[0] : p.s));
  if(p.t==='num'||p.t==='roots'||p.t==='set'){ inp=inp.replace(/\s*\([^()]*\)/g,'').replace(/\s+hoặc.*$/,''); if(/ = /.test(inp)) inp=inp.split(' = ').pop(); if(/ ≈ /.test(inp)) inp=inp.split(' ≈ ')[0]; if(p.t==='num') inp=inp.replace(/,\s*[\d.]+\s*$/,'');}
  if(p.t==='formula'||p.t==='logic'){ if(/ = /.test(inp)) inp=inp.split(' = ').pop(); }
  const r=checkPart(p,inp);
  if(!r.ok) fails.push(`ch${ch.no} q${q.n} [${p.l}] s="${inp}" -> ${JSON.stringify(r)}`);
})));
console.log('parts',n,'fails',fails.length); if(fails.length){ console.log(fails.join('\n')); process.exit(1); }
