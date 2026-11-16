/* Shared, side-effect-free Script Studio dialogue parser. No network or storage writes. */
(function(root){
 'use strict';
 const MAX_BYTES=2*1024*1024,MAX_LINES=1500;
 const text=v=>typeof v==='string'?v.trim():'';
 const clean=s=>s.replace(/^\s*>+\s?/,'').replace(/^\s*(?:[-*+]|\d+[.)])\s+/,'').replace(/(\*\*|__)(.+?)\1/g,'$2').replace(/`([^`]+)`/g,'$1').trim();
  function plain(raw){const lines=[];const isKo=t=>/[가-힣]/.test(t)&&!/[A-Za-z]{2,}/.test(t.replace(/\([^)]*\)/g,''));const speaker=/^([A-Za-z가-힣][A-Za-z가-힣 .'’\-]{0,29}?)\s*[:：]\s*(.+)$/;
   for(const rawLine of String(raw).replace(/\r/g,'').split('\n')){const s=clean(rawLine);if(!s||/^#{1,6}\s|^```|^~~~/.test(s))continue;
    const m=s.match(speaker),label=m?.[1].trim().toLowerCase(),body=m?.[2].trim();
    if(m&&['번역','의역','한국어','직역'].includes(label)){if(!lines.length)throw Error('번역 앞에 영어 대사를 써 줘.');const field=label==='직역'?'literal':'ko';lines.at(-1)[field]+=(lines.at(-1)[field]?' ':'')+body;continue;}
    if((!m&&isKo(s))||(m&&isKo(body))){if(!lines.length)throw Error('한글 뜻 앞에 영어 대사를 써 줘.');lines.at(-1).ko+=(lines.at(-1).ko?' ':'')+(m?body:s);continue;}
    if(m)lines.push({id:'L'+String(lines.length+1).padStart(3,'0'),speaker:m[1].trim(),en:body,ko:'',literal:''});
    else if(lines.length)lines.at(-1).en+=' '+s;
    else lines.push({id:'L001',speaker:'',en:s,ko:'',literal:''});
   }
   if(lines.length>MAX_LINES)throw Error('대사팩은 1,500줄 이하로 나눠 줘.');return lines;}
 function validateLines(items){if(!Array.isArray(items)||!items.length||items.length>MAX_LINES)throw Error('영어 대사가 1~1,500줄 필요해.');const ids=new Set();return items.map((x,i)=>{if(!x||typeof x!=='object')throw Error('대사 형식이 잘못됐어.');const row={id:text(x.id)||'L'+String(i+1).padStart(3,'0'),speaker:text(x.speaker),en:text(x.en),ko:text(x.ko),literal:text(x.literal)};if(!row.en||!/[A-Za-z]/.test(row.en))throw Error((i+1)+'번 영어 대사를 확인해 줘.');if(ids.has(row.id))throw Error('중복 대사 ID: '+row.id);ids.add(row.id);return row;});}
 function parse(raw,filename='dialogue.md'){if(typeof raw!=='string'||new TextEncoder().encode(raw).length>MAX_BYTES)throw Error('대사팩은 UTF-8 2MB 이하 파일로 나눠 줘.');raw=raw.replace(/^\uFEFF/,'').replace(/\r/g,'');const meta={},body=[],items=[];let current=null,title='',inCode=false,structured=false;
 const alias={'speaker':'speaker','화자':'speaker','en':'en','영어':'en','영어 대사':'en','ko':'ko','한국어':'ko','번역':'ko','의역':'ko','literal':'literal','lit':'literal','직역':'literal'};
 for(const line of raw.split('\n')){if(/^\s*(```|~~~)/.test(line)){inCode=!inCode;continue;}if(inCode)continue;const h=line.match(/^#\s+(.+)$/);if(h){title ||= h[1].trim();continue;}const m=line.match(/^\s*-\s*([^:：]+)\s*[:：]\s*(.*)$/);const key=m?.[1].trim().toLowerCase();
  if(!current&&m&&['studio-pack','title','version'].includes(key)){if(Object.hasOwn(meta,key))throw Error('중복 메타데이터: '+key);meta[key]=m[2].trim();continue;}
  if(!current&&m&&['book','episode','에피소드'].includes(key))throw Error('이 파일은 기존 학습팩 형식이야. 대사팩 형식으로 별도 제작해 줘.');
  const id=line.match(/^##\s+(\S+)\s*$/);if(id){if(current)items.push(current);current={id:id[1],speaker:'',en:'',ko:'',literal:''};structured=true;continue;}
  if(current){if(m&&alias[key]){const f=alias[key];if(current[f])throw Error('같은 대사 필드가 두 번 있어: '+key);current[f]=m[2].trim();}else if(line.trim())throw Error('대사 필드는 - speaker / en / ko / literal 형식으로 써 줘.');}
  else body.push(line);
 }
 if(current)items.push(current);if(structured&&body.some(x=>x.trim()))throw Error('일반 대사와 ## 대사 ID 형식을 한 파일에 섞지 말아 줘.');const lines=validateLines(structured?items:plain(body.join('\n'))),fallback=filename.replace(/^.*[\\/]/,'').replace(/\.[^.]+$/,'');const id=meta['studio-pack']||fallback;if(!/^[A-Za-z0-9가-힣][A-Za-z0-9가-힣_. -]{0,119}$/.test(id)||['__proto__','constructor','prototype'].includes(id))throw Error('studio-pack ID는 120자 이내의 문자·숫자·공백·밑줄·마침표·하이픈으로 써 줘.');return {id,title:meta.title||title||fallback,version:meta.version||'',lines};}
 function toText(lines){return validateLines(lines).map(x=>(x.speaker?x.speaker+': ':'')+x.en+(x.ko?'\n번역: '+x.ko:'')+(x.literal?'\n직역: '+x.literal:'')).join('\n\n');}
 root.ScriptPacks={parse,parsePlain:plain,validateLines,toText,MAX_BYTES,MAX_LINES};
})(typeof globalThis!=='undefined'?globalThis:window);
