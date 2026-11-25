const fs=require('fs'),path=require('path');const APP=process.argv[2];const ts=require(APP+'/node_modules/typescript');
const cache={};function load(spec,from){ if(spec.startsWith('.')&&from) spec='@/'+path.relative(path.join(APP,'src'),path.resolve(path.dirname(from),spec)); if(spec.startsWith('@/')){let p=path.join(APP,'src',spec.slice(2)); if(p.endsWith('.json')) return JSON.parse(fs.readFileSync(p,'utf8'));
 for(const ext of ['.ts','.tsx','.mjs']) if(fs.existsSync(p+ext)){p+=ext;break;} if(cache[p]) return cache[p].exports; const m={exports:{}};cache[p]=m;
 const out=ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('module','exports','require',out)(m,m.exports,x=>load(x,p)); return m.exports;} return require(spec);}
const {commandIconAccessibleName}=load('@/lib/sf6-command-icon-contract');const {tokenizeSf6Command}=load('@/lib/sf6-command-tokens');const {commandDirectionDisplay}=load('@/lib/command-direction-display');
const {unifiedCommandDisplay}=load('@/lib/character-unified-contract');
const items=JSON.parse(fs.readFileSync(0,'utf8'));const out={};
for(const [id,scheme,text,name,type] of items){ const move={id:'m',name,moveType:type,commands:[]};const cmd={moveId:'m',scheme,commandText:text,numericNotation:null,buttonNotation:null,conditionText:null,sortOrder:0};
 let v=text; try{ v=unifiedCommandDisplay(move,cmd).value; }catch(e){}
 out[id]=commandIconAccessibleName(tokenizeSf6Command(commandDirectionDisplay(v))); }
process.stdout.write(JSON.stringify(out));
