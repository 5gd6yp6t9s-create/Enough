const K='enough_v14';
const OLDK='enough_v1';
const defaultState={profile:{name:'',age:'',studyMode:'full',goal:'Study enough. Live enough.',partner:'',share:true,theme:'light',onboarded:false,researchMode:'self',participantId:'',pilotStart:'',baselineDays:7,interventionDays:21,baselineSurvey:null,exitSurvey:null},days:[],today:{date:keyDate(),finish:['','',''],planned:420,actual:'',sleep:7,meals:3,caffeine:0,stress:3,energy:3,urge:3,met:'Yes',reason:'Did not continue',done:'',wait:'',need:'Nothing today',partnerResponse:''}};
let S=load();let page='today';let focusTimer=null;let focusLeft=0;let focusStartedAt=null;
function keyDate(d=new Date()){return d.toISOString().slice(0,10)}
function load(){try{let raw=localStorage.getItem(K)||localStorage.getItem(OLDK)||'{}';let x=Object.assign({},defaultState,JSON.parse(raw));x.sessions=x.sessions||[];x.reflections=x.reflections||[];x.supportInbox=x.supportInbox||[];x.profile=Object.assign({},defaultState.profile,x.profile||{});return x}catch{return {...structuredClone(defaultState),sessions:[],reflections:[],supportInbox:[]}}}
function save(){localStorage.setItem(K,JSON.stringify(S))}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function calc(d){let p=+d.planned||0,a=+d.actual||0,u=+d.urge||0,sl=+d.sleep||0,st=+d.stress||0,me=+d.meals||0;let oe=a>p&&u>=4&&d.reason==='Anxiety/fear of stopping'?1:0;let ss=d.met==='Yes'&&u>=4&&a<=p?1:0;let rs=sl<7||(me<3&&st>=4)?1:0;let rd=rs&&a<=p?1:0;let fla=d.met==='Yes'&&a<=p+30?1:0;let sp=sl>=7?1:0;let psm=d.need==='Nothing today'||d.partnerResponse?1:0;let aag=u>=4?Math.max(0,1-Math.max(0,a-p)/120):null;let sre=ss||rd?1:0;let ebi=Math.round(100*(.30*fla+.25*sp+.15*psm+.20*(1-oe)+.10*sre));return{oe,ss,rs,rd,fla,sp,psm,aag,sre,ebi}}
function syncToday(){if(S.today.date!==keyDate()){S.today={...structuredClone(defaultState.today),date:keyDate()};save()}}
function header(){return `<div class="top"><div class="brand">ENOUGH <span class="sprout">🌱</span><small>Study enough. Live enough.</small></div><button class="pill hide-mobile" onclick="toggleTheme()">${S.profile.theme==='dark'?'☀ Light':'◐ Dark'}</button></div>`}
function nav(){let items=[['today','Today','⌂'],['focus','Focus','◷'],['dashboard','Insights','▥'],['history','History','▣'],['together','Together','♧'],['settings','Settings','⚙']];return `<nav class="nav">${items.map(([id,l,i])=>`<button class="${page===id?'active':''}" onclick="go('${id}')"><div>${i}</div>${l}</button>`).join('')}</nav>`}
function go(p){page=p;render()}
function render(){syncToday();document.documentElement.dataset.theme=S.profile.theme;if(!S.profile.onboarded){document.getElementById('app').innerHTML=onboarding();return}let c=page==='today'?today():page==='focus'?focusPage():page==='dashboard'?dashboard():page==='together'?together():page==='history'?history():settings();document.getElementById('app').innerHTML=`<main class="shell">${header()}${c}</main>${nav()}`}
function val(id,v){S.today[id]=v;save()}
function onboarding(){return `<main class="onboard-shell"><section class="onboard-brand"><div class="logo-big">ENOUGH <span>🌱</span></div><div class="tagline">Study enough. Live enough.</div><div class="version">v1.5 · Research Dashboard</div></section><section class="onboard-card"><div class="label">Welcome to ENOUGH</div><h1>เริ่มต้นด้วยข้อมูลของคุณ</h1><p>ข้อมูลนี้ใช้เพื่อปรับ finish line และการสรุปผลให้เข้ากับรูปแบบชีวิตของคุณ ไม่ได้ใช้จัดอันดับกับคนอื่น</p><div class="field"><label>ชื่อที่อยากให้เรียก</label><input id="obName" placeholder="เช่น แพรว / May / Nickname"></div><div class="field"><label>อายุ</label><input id="obAge" type="number" min="15" max="100" placeholder="20"></div><div class="field"><label>รูปแบบชีวิตช่วงนี้</label><div class="mode-grid"><button id="modeFull" class="mode-card selected" onclick="pickMode('full')"><b>📚 อ่านหนังสือเต็มวัน</b><small>เตรียมสอบ / gap period / self-study เป็นกิจกรรมหลัก</small></button><button id="modeMixed" class="mode-card" onclick="pickMode('mixed')"><b>💼 เรียนหรือทำงาน + อ่านหนังสือ</b><small>มี class / งานประจำวัน แล้วแบ่งเวลามาอ่านเพิ่ม</small></button></div></div><div class="field"><label>โหมดการใช้งาน</label><div class="mode-grid"><button id="researchSelf" class="mode-card selected" onclick="pickResearchMode('self')"><b>🧪 Self-pilot 28 วัน</b><small>Baseline 7 วัน → ENOUGH 21 วัน · สร้างรหัสไม่ระบุตัวตนและ Research Export</small></button><button id="researchDemo" class="mode-card" onclick="pickResearchMode('demo')"><b>🌱 Demo / ใช้งานทั่วไป</b><small>ใช้ฟีเจอร์ทั้งหมดโดยไม่แบ่ง phase งานวิจัย</small></button></div></div><div class="field"><label>เป้าหมายช่วงนี้</label><input id="obGoal" placeholder="เช่น เตรียม A-Level โดยไม่หักโหม"></div><button class="btn primary wide" onclick="finishOnboarding()">เริ่มใช้งาน ENOUGH →</button><div class="privacy-note">🔒 เก็บข้อมูลไว้ใน browser เครื่องนี้ · คุณเลือกเองว่าอะไรจะแชร์</div></section></main>`}
let onboardingMode='full';let onboardingResearch='self';
function pickMode(m){onboardingMode=m;document.getElementById('modeFull')?.classList.toggle('selected',m==='full');document.getElementById('modeMixed')?.classList.toggle('selected',m==='mixed')}
function pickResearchMode(m){onboardingResearch=m;document.getElementById('researchSelf')?.classList.toggle('selected',m==='self');document.getElementById('researchDemo')?.classList.toggle('selected',m==='demo')}
function makeParticipantId(){return 'EN-'+Math.random().toString(36).slice(2,7).toUpperCase()}
function finishOnboarding(){let n=document.getElementById('obName').value.trim(),a=document.getElementById('obAge').value,g=document.getElementById('obGoal').value.trim();if(!n||!a){alert('ใส่ชื่อและอายุก่อนนะ');return}S.profile.name=n;S.profile.age=a;S.profile.studyMode=onboardingMode;S.profile.goal=g||'Study enough. Live enough.';S.profile.researchMode=onboardingResearch;S.profile.participantId=makeParticipantId();S.profile.pilotStart=keyDate();S.profile.onboarded=true;S.today.planned=onboardingMode==='full'?420:240;save();render()}
function dayDiff(a,b){return Math.floor((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/86400000)}
function phaseFor(date){if(S.profile.researchMode!=='self')return 'General';let n=dayDiff(S.profile.pilotStart||date,date)+1;return n<=7?'Baseline':n<=28?'ENOUGH':'Follow-up'}
function pilotDay(date=keyDate()){return Math.max(1,dayDiff(S.profile.pilotStart||date,date)+1)}
function phaseBadge(){if(S.profile.researchMode!=='self')return '<span class="demo-badge">GENERAL MODE</span>';let n=pilotDay(),ph=phaseFor(keyDate());return `<span class="demo-badge">DAY ${n}/28 · ${ph.toUpperCase()}</span>`}
function researchMetrics(ds){let ms=ds.map(calc), n=ds.length||1, high=ds.filter(d=>+d.urge>=4);return {days:ds.length,oe:ms.reduce((a,m)=>a+m.oe,0),ss:ms.reduce((a,m)=>a+m.ss,0),rd:ms.reduce((a,m)=>a+m.rd,0),fla:100*ms.reduce((a,m)=>a+m.fla,0)/n,sleep:ds.reduce((a,d)=>a+(+d.sleep||0),0)/n,dev:ds.reduce((a,d)=>a+((+d.actual||0)-(+d.planned||0)),0)/n,aag:high.length?high.map(calc).reduce((a,m)=>a+(m.aag??0),0)/high.length:null}}
function baselineSurvey(){let q=S.profile.baselineSurvey||{};return `<section class="hero"><div class="label">Day 0 · Baseline questionnaire</div><h1>Before the pilot starts.</h1><p>แบบสั้นสำหรับ development/self-pilot เท่านั้น ไม่ใช่แบบวินิจฉัยหรือ validated scale</p>${phaseBadge()}</section><div class="card full"><div class="field"><label>ช่วงนี้รู้สึกว่าหยุดอ่านเมื่อถึงแผนได้ยากแค่ไหน? · ${q.stopDifficulty||3}/5</label><input id="qStop" type="range" min="1" max="5" value="${q.stopDifficulty||3}" oninput="this.previousElementSibling.innerHTML='ช่วงนี้รู้สึกว่าหยุดอ่านเมื่อถึงแผนได้ยากแค่ไหน? · '+this.value+'/5'"></div><div class="field"><label>รู้สึกผิดเมื่อพักแค่ไหน? · ${q.restGuilt||3}/5</label><input id="qGuilt" type="range" min="1" max="5" value="${q.restGuilt||3}" oninput="this.previousElementSibling.innerHTML='รู้สึกผิดเมื่อพักแค่ไหน? · '+this.value+'/5'"></div><div class="field"><label>การนอนเฉลี่ยโดยประมาณ (ชม.)</label><input id="qSleep" type="number" step=".5" value="${q.sleep||7}"></div><div class="field"><label>สิ่งที่อยากให้ ENOUGH ช่วย</label><textarea id="qGoal">${esc(q.goal||'')}</textarea></div><button class="btn primary" onclick="saveBaselineSurvey()">Save Day 0</button></div>`}
function saveBaselineSurvey(){S.profile.baselineSurvey={stopDifficulty:+document.getElementById('qStop').value,restGuilt:+document.getElementById('qGuilt').value,sleep:+document.getElementById('qSleep').value,goal:document.getElementById('qGoal').value,completedAt:new Date().toISOString()};save();render()}
function exitSurvey(){let q=S.profile.exitSurvey||{};return `<section class="hero"><div class="label">Day 28 · Exit questionnaire</div><h1>What changed — and what did not?</h1><p>ประเมิน usability และประสบการณ์ ไม่ใช่การพิสูจน์ประสิทธิผลทางคลินิก</p></section><div class="card full"><div class="field"><label>ENOUGH ช่วยให้กำหนด finish line ชัดขึ้น · ${q.finishUseful||3}/5</label><input id="xFinish" type="range" min="1" max="5" value="${q.finishUseful||3}"></div><div class="field"><label>ระบบรู้สึกเป็นภาระในการกรอก · ${q.burden||3}/5</label><input id="xBurden" type="range" min="1" max="5" value="${q.burden||3}"></div><div class="field"><label>ยังรู้สึกว่าตัวเองเป็นคนตัดสินใจ ไม่ได้ถูกแอปควบคุม · ${q.autonomy||3}/5</label><input id="xAuto" type="range" min="1" max="5" value="${q.autonomy||3}"></div><div class="field"><label>สิ่งที่ช่วยที่สุด / ควรแก้ที่สุด</label><textarea id="xNote">${esc(q.note||'')}</textarea></div><button class="btn primary" onclick="saveExitSurvey()">Save exit questionnaire</button></div>`}
function saveExitSurvey(){S.profile.exitSurvey={finishUseful:+document.getElementById('xFinish').value,burden:+document.getElementById('xBurden').value,autonomy:+document.getElementById('xAuto').value,note:document.getElementById('xNote').value,completedAt:new Date().toISOString()};save();render()}
function focusPage(){let sessions=(S.sessions||[]).filter(x=>x.date===keyDate());let total=sessions.reduce((a,x)=>a+(+x.minutes||0),0);return `<section class="hero focus-hero"><div class="label">Focus Session</div><h1>Study one block at a time.</h1><p>จับเวลา 25 / 50 / 90 นาที แล้วเพิ่มเวลาเข้า Actual study time อัตโนมัติ</p></section><div class="grid"><div class="card focus-main"><div class="seg"><button class="active" onclick="startFocus(25)">Pomodoro · 25</button><button onclick="startFocus(50)">Deep · 50</button><button onclick="startFocus(90)">Long · 90</button></div><div class="focus-ring"><div id="focusStatus" class="focus-clock">Ready</div><small>Focus time</small></div><div class="field"><label>วิชา / งาน</label><input id="focusTask" placeholder="Biology — Genetics"></div><div class="actions center"><button class="btn soft" onclick="pauseFocus()">Ⅱ Pause</button><button class="btn primary" onclick="finishFocus()">✓ Finish & log</button></div></div><div class="card"><div class="label">Today's sessions</div><div class="kpi">${total} <small>min</small></div>${sessions.length?sessions.map(x=>`<div class="session-row"><span>${esc(x.task)}</span><b>${x.minutes}m</b></div>`).join(''):'<div class="empty">ยังไม่มี session วันนี้</div>'}<div class="notice">เมื่อถึง finish line แล้วแต่ยังอยากกด session ต่อ ลองถามตัวเองว่า <b>งานยังต้องการเวลา หรือการหยุดทำให้รู้สึกไม่สบายใจ?</b></div></div></div>`}
function today(){let d=S.today,m=calc(d);return `<section class="hero"><div class="label">${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div><h1>What would make today enough?</h1><p>กำหนดเส้นชัยก่อนเริ่ม ไม่ต้องเลื่อนมันออกไปทุกครั้งที่ความกังวลเพิ่มขึ้น</p>${phaseBadge()}</section>${S.profile.researchMode==='self'&&!S.profile.baselineSurvey?'<div class="notice warn"><b>Day 0 ยังไม่เสร็จ</b> · ไปที่ Insights เพื่อกรอก baseline questionnaire ก่อนเริ่ม pilot</div>':''}<div class="grid">
<div class="card"><div class="label">Morning finish line</div>${[0,1,2].map(i=>`<div class="field"><label>${i+1}.</label><input value="${esc(d.finish[i])}" placeholder="Finite task for today" oninput="S.today.finish[${i}]=this.value;save()"></div>`).join('')}<div class="field"><label>Planned self-study</label><input type="number" value="${d.planned}" oninput="val('planned',this.value)"></div></div>
<div class="card"><div class="label">Body before output</div><div class="field"><label>Sleep last night — ${d.sleep} h</label><input type="range" min="3" max="10" step=".5" value="${d.sleep}" oninput="val('sleep',this.value);render()"></div><div class="field"><label>Meals today</label><select onchange="val('meals',this.value)">${[0,1,2,3].map(x=>`<option ${+d.meals===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Caffeine servings</label><input type="number" min="0" max="10" value="${d.caffeine}" oninput="val('caffeine',this.value)"></div></div>
<div class="card full"><div class="label">Evening check-in</div><div class="grid"><div class="card third"><div class="field"><label>Actual study minutes</label><input type="number" value="${d.actual}" placeholder="e.g. 390" oninput="val('actual',this.value)"></div><div class="field"><label>Finish line met?</label><select onchange="val('met',this.value)">${['Yes','Partly','No'].map(x=>`<option ${d.met===x?'selected':''}>${x}</option>`).join('')}</select></div></div>${slider('stress','Stress',d.stress)}${slider('urge','Urge to continue',d.urge)}</div>
<div class="field"><label>Why continue?</label><select onchange="val('reason',this.value);render()">${['Did not continue','Still productive','Anxiety/fear of stopping','Deadline/required work','Lost track of time','Other'].map(x=>`<option ${d.reason===x?'selected':''}>${x}</option>`).join('')}</select></div>${m.oe?`<div class="notice warn"><b>You already reached beyond the plan.</b><br>Are you continuing because the work still needs you — or because stopping feels uncomfortable?</div>`:''}${m.ss?`<div class="notice"><b>Successful Stop.</b> Stopping while anxious still counts as self-regulation.</div>`:''}<div class="grid"><div class="card"><div class="field"><label>DONE TODAY</label><textarea oninput="val('done',this.value)">${esc(d.done)}</textarea></div></div><div class="card"><div class="field"><label>WHAT CAN WAIT</label><textarea oninput="val('wait',this.value)">${esc(d.wait)}</textarea></div></div></div>
<div class="field"><label>Need from partner</label><select onchange="val('need',this.value)">${['Nothing today','Just stay','Encourage me','Help me plan','Listen only','Call me','Let me rest'].map(x=>`<option ${d.need===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="actions"><button class="btn primary" onclick="closeDay()">Close today</button><button class="btn" onclick="go('dashboard')">See insights</button></div></div></div>`}
function slider(k,l,v){return `<div class="card third"><div class="field"><label>${l}</label><div class="range"><input type="range" min="1" max="5" value="${v}" oninput="val('${k}',this.value);render()"><b>${v}</b></div></div></div>`}
function closeDay(){let d=structuredClone(S.today);if(!d.actual){alert('ใส่ Actual study minutes ก่อนนะ');return}let i=S.days.findIndex(x=>x.date===d.date);if(i>=0)S.days[i]=d;else S.days.push(d);save();alert('Today is closed. You do not need to earn more today.');go('dashboard')}
function dashboard(){
  if(S.profile.researchMode==='self'&&!S.profile.baselineSurvey)return baselineSurvey();
  if(S.profile.researchMode==='self'&&pilotDay()>=28&&!S.profile.exitSurvey)return exitSurvey();
  let ds=S.days.slice().sort((a,b)=>a.date.localeCompare(b.date)),last=ds.slice(-30),mets=last.map(calc);
  let avg=k=>mets.length?mets.reduce((s,x)=>s+(x[k]??0),0)/mets.length:0;
  let avgRaw=k=>last.length?last.reduce((s,x)=>s+(+x[k]||0),0)/last.length:0;
  let pattern=discoverPattern(last);
  let personal=last.length?`<div class="grid"><div class="card third"><div class="label">ENOUGH Balance</div><div class="kpi">${avg('ebi').toFixed(0)}</div><div class="bar"><i style="width:${avg('ebi')}%"></i></div></div><div class="card third"><div class="label">Overstudy episodes</div><div class="kpi">${mets.reduce((s,x)=>s+x.oe,0)}</div><small>last ${last.length} logged days</small></div><div class="card third"><div class="label">Sleep protected</div><div class="kpi">${Math.round(avg('sp')*100)}%</div><small>≥ 7 hours</small></div><div class="card"><div class="label">Study minutes</div>${lineChart(last.map(x=>+x.actual||0),'min')}</div><div class="card"><div class="label">Sleep</div>${lineChart(last.map(x=>+x.sleep||0),'h')}</div><div class="card full pattern-card"><div class="label">Pattern discovery</div><h2>${pattern.title}</h2><p>${pattern.text}</p><small>${pattern.note}</small></div><div class="card full"><div class="label">Weekly reflection</div>${weeklyReflection()}</div><div class="card full"><div class="metric"><span>Finish-line adherence</span><b>${Math.round(avg('fla')*100)}%</b></div><div class="metric"><span>Average stress</span><b>${avgRaw('stress').toFixed(1)} / 5</b></div><div class="metric"><span>Average urge</span><b>${avgRaw('urge').toFixed(1)} / 5</b></div><div class="metric"><span>Successful stops</span><b>${mets.reduce((s,x)=>s+x.ss,0)}</b></div><div class="metric"><span>Recovery days</span><b>${mets.reduce((s,x)=>s+x.rd,0)}</b></div></div></div>`:`<div class="empty">ยังไม่มีวันที่ปิดบันทึก<br>กรอก Today แล้วกด <b>Close today</b> เพื่อเริ่มเห็น pattern</div>`;
  return `<section class="hero"><div class="label">Insights</div><h1>Patterns, not grades.</h1><p>ดูแนวโน้มเพื่อช่วยตัดสินใจ ไม่ใช่เพื่อทำให้ทุกช่องต้องเป็นสีเขียว</p></section>
  <div class="insight-tabs"><button class="${window.insightTab!=='research'?'active':''}" onclick="window.insightTab='personal';render()">Personal</button><button class="${window.insightTab==='research'?'active':''}" onclick="window.insightTab='research';render()">Research</button></div>
  ${window.insightTab==='research'&&S.profile.researchMode==='self'?researchDashboard():window.insightTab==='research'?'<div class="notice">Research Dashboard is available in Self-pilot mode.</div>':personal}`;
}

function splitResearchDays(){
  let ds=S.days.slice().sort((a,b)=>a.date.localeCompare(b.date));
  return {
    baseline: ds.filter(d=>(d.phase||phaseFor(d.date))==='Baseline'),
    enough: ds.filter(d=>(d.phase||phaseFor(d.date))==='ENOUGH')
  };
}
function phaseSummary(ds){
  if(!ds.length)return {n:0,study:0,dev:0,sleep:0,stress:0,urge:0,oe:0,ss:0,rd:0,fla:0,aag:null,ebi:0,sp:0};
  let ms=ds.map(calc), hi=ms.filter(m=>m.aag!==null);
  return {
    n:ds.length,
    study:ds.reduce((a,d)=>a+(+d.actual||0),0)/ds.length,
    dev:ds.reduce((a,d)=>a+((+d.actual||0)-(+d.planned||0)),0)/ds.length,
    sleep:ds.reduce((a,d)=>a+(+d.sleep||0),0)/ds.length,
    stress:ds.reduce((a,d)=>a+(+d.stress||0),0)/ds.length,
    urge:ds.reduce((a,d)=>a+(+d.urge||0),0)/ds.length,
    oe:ms.reduce((a,m)=>a+m.oe,0),
    ss:ms.reduce((a,m)=>a+m.ss,0),
    rd:ms.reduce((a,m)=>a+m.rd,0),
    fla:100*ms.reduce((a,m)=>a+m.fla,0)/ds.length,
    aag:hi.length?hi.reduce((a,m)=>a+m.aag,0)/hi.length:null,
    ebi:ms.reduce((a,m)=>a+m.ebi,0)/ds.length,
    sp:100*ms.reduce((a,m)=>a+m.sp,0)/ds.length
  };
}
function deltaText(a,b,unit='',lowerBetter=false){
  if(!a.n||!b.n)return '—';
  let d=b-a, arrow=d>0?'↑':d<0?'↓':'→', good=lowerBetter?d<0:d>0;
  return `<span class="${d===0?'':good?'delta-good':'delta-watch'}">${arrow} ${Math.abs(d).toFixed(unit==='%'?0:1)}${unit}</span>`;
}
function researchDashboard(){
  let parts=splitResearchDays(), b=phaseSummary(parts.baseline), e=phaseSummary(parts.enough);
  let all=[...parts.baseline,...parts.enough];
  let enoughReady=e.n>0, baseReady=b.n>0;
  let corr=urgeExtraAssociation(all);
  return `<section class="research-head">
    <div><div class="label">Research dashboard · ${esc(S.profile.participantId||'anonymous')}</div>
    <h2>Baseline → ENOUGH</h2><p>Within-person descriptive comparison for this self-pilot. No efficacy or causal claim.</p></div>
    <button class="btn primary" onclick="printResearchSummary()">Print / Save 1-page summary</button>
  </section>
  <div class="phase-strip">
    <div class="phase-box"><b>Baseline</b><strong>${b.n}/7</strong><small>logged days</small></div>
    <div class="phase-arrow">→</div>
    <div class="phase-box"><b>ENOUGH</b><strong>${e.n}/21</strong><small>logged days</small></div>
  </div>
  ${(!baseReady||!enoughReady)?`<div class="notice warn"><b>Comparison is still incomplete.</b> Research cards update as each phase gets logged. Missing days are not treated as zero.</div>`:''}
  <div class="research-grid">
    ${researchMetricCard('Overstudy episodes',b.oe,e.oe,'count',true,b,e)}
    ${researchMetricCard('Successful stops',b.ss,e.ss,'count',false,b,e)}
    ${researchMetricCard('Sleep protection',b.sp,e.sp,'%',false,b,e)}
    ${researchMetricCard('Finish-line adherence',b.fla,e.fla,'%',false,b,e)}
    ${researchMetricCard('Average AAG',b.aag,e.aag,'',false,b,e)}
    ${researchMetricCard('Study-plan deviation',b.dev,e.dev,' min/day',true,b,e)}
  </div>
  <div class="grid">
    <div class="card full"><div class="label">AAG trend · high-urge days only</div>${researchAAGChart(all)}<small>Higher AAG means high urge translated into less extra study. Experimental product metric, not a validated psychological scale.</small></div>
    <div class="card"><div class="label">Overstudy per logged week</div>${phaseBars(b,e,'oe')}</div>
    <div class="card"><div class="label">Successful stops per logged week</div>${phaseBars(b,e,'ss')}</div>
    <div class="card"><div class="label">Sleep</div>${phaseCompareBar('Average sleep',b.sleep,e.sleep,10,'h')}</div>
    <div class="card"><div class="label">Finish-line adherence</div>${phaseCompareBar('Adherence',b.fla,e.fla,100,'%')}</div>
    <div class="card full pattern-card"><div class="label">Urge → extra study relationship</div><h2>${corr.title}</h2><p>${corr.text}</p><small>${corr.note}</small></div>
  </div>`;
}
function researchMetricCard(title,bv,ev,unit,lowerBetter,b,e){
  let fmt=v=>v===null||v===undefined?'—':(unit==='%'?v.toFixed(0)+'%':unit==='count'?v.toFixed(0):v.toFixed(2)+(unit||''));
  let delta='—';
  if(b.n&&e.n&&bv!==null&&ev!==null){
    let d=ev-bv, good=lowerBetter?d<0:d>0;
    delta=`<span class="${d===0?'':good?'delta-good':'delta-watch'}">${d>0?'↑':d<0?'↓':'→'} ${Math.abs(d).toFixed(unit==='%'||unit==='count'?0:2)}${unit==='%'?'%':''}</span>`;
  }
  return `<div class="research-card"><div class="label">${title}</div><div class="phase-values"><span>Baseline <b>${fmt(bv)}</b></span><span>ENOUGH <b>${fmt(ev)}</b></span></div><div class="research-delta">${delta}</div></div>`;
}
function phaseBars(b,e,key){
  let bw=b.n?(b[key]/b.n*7):0, ew=e.n?(e[key]/e.n*7):0, max=Math.max(1,bw,ew);
  return `<div class="hbar-row"><span>Baseline</span><i><em style="width:${100*bw/max}%"></em></i><b>${bw.toFixed(1)}</b></div>
  <div class="hbar-row"><span>ENOUGH</span><i><em style="width:${100*ew/max}%"></em></i><b>${ew.toFixed(1)}</b></div>
  <small>Normalized per 7 logged days.</small>`;
}
function phaseCompareBar(label,bv,ev,max,unit){
  let b=Math.max(0,Math.min(max,bv||0)),e=Math.max(0,Math.min(max,ev||0));
  return `<div class="hbar-row"><span>Baseline</span><i><em style="width:${100*b/max}%"></em></i><b>${b.toFixed(1)}${unit}</b></div>
  <div class="hbar-row"><span>ENOUGH</span><i><em style="width:${100*e/max}%"></em></i><b>${e.toFixed(1)}${unit}</b></div>`;
}
function researchAAGChart(ds){
  let hi=ds.filter(d=>+d.urge>=4).map(d=>({date:d.date,val:calc(d).aag,phase:d.phase||phaseFor(d.date)}));
  if(!hi.length)return '<div class="empty">No high-urge days logged yet.</div>';
  let w=700,h=210,p=26, pts=hi.map((x,i)=>`${p+i*(w-2*p)/Math.max(1,hi.length-1)},${h-p-(x.val||0)*(h-2*p)}`).join(' ');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <line class="axis" x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}"/>
    <line class="axis faint" x1="${p}" y1="${p}" x2="${w-p}" y2="${p}"/>
    <polyline class="line" points="${pts}"/>
    ${hi.map((x,i)=>{let [cx,cy]=pts.split(' ')[i].split(',');return `<circle class="dot" cx="${cx}" cy="${cy}" r="4"><title>${x.date} · ${x.phase} · AAG ${x.val.toFixed(2)}</title></circle>`}).join('')}
  </svg>`;
}
function urgeExtraAssociation(ds){
  if(ds.length<5)return {title:'More days are needed.',text:'At least 5 closed days are needed before this descriptive relationship is shown.',note:'No missing day is treated as zero.'};
  let xs=ds.map(d=>+d.urge||0), ys=ds.map(d=>Math.max(0,(+d.actual||0)-(+d.planned||0)));
  let mx=xs.reduce((a,x)=>a+x,0)/xs.length,my=ys.reduce((a,x)=>a+x,0)/ys.length;
  let num=0,dx=0,dy=0; xs.forEach((x,i)=>{num+=(x-mx)*(ys[i]-my);dx+=(x-mx)**2;dy+=(ys[i]-my)**2});
  let r=(dx&&dy)?num/Math.sqrt(dx*dy):0;
  let high=ds.filter(d=>+d.urge>=4), low=ds.filter(d=>+d.urge<4);
  let av=a=>a.length?a.reduce((s,d)=>s+Math.max(0,(+d.actual||0)-(+d.planned||0)),0)/a.length:0;
  return {title:'Urge and extra study are being tracked together.',text:`Across ${ds.length} logged days, high-urge days had ${av(high).toFixed(0)} extra min/day on average versus ${av(low).toFixed(0)} on lower-urge days. Descriptive Pearson r = ${r.toFixed(2)}.`,note:'Observed association in this self-tracking dataset only. It does not show that urge caused extra study.'};
}
function researchSummaryHTML(){
  let p=splitResearchDays(),b=phaseSummary(p.baseline),e=phaseSummary(p.enough),corr=urgeExtraAssociation([...p.baseline,...p.enough]);
  return `<div class="summary-sheet">
  <div class="summary-brand">ENOUGH 🌱 <small>Research Pilot Summary</small></div>
  <h1>${esc(S.profile.participantId||'Anonymous participant')}</h1>
  <p>${S.profile.studyMode==='full'?'Full-day study':'Class/work + study'} · Baseline ${b.n}/7 days · ENOUGH ${e.n}/21 days</p>
  <div class="summary-cards">
    <div><small>Overstudy</small><b>${b.oe} → ${e.oe}</b></div>
    <div><small>Successful stops</small><b>${b.ss} → ${e.ss}</b></div>
    <div><small>Sleep protection</small><b>${b.sp.toFixed(0)}% → ${e.sp.toFixed(0)}%</b></div>
    <div><small>Finish-line adherence</small><b>${b.fla.toFixed(0)}% → ${e.fla.toFixed(0)}%</b></div>
    <div><small>AAG</small><b>${b.aag===null?'—':b.aag.toFixed(2)} → ${e.aag===null?'—':e.aag.toFixed(2)}</b></div>
    <div><small>Plan deviation</small><b>${b.dev.toFixed(0)} → ${e.dev.toFixed(0)} min/day</b></div>
  </div>
  <h2>Observed pattern</h2><p>${corr.text}</p>
  <h2>Interpretation boundary</h2><p>This is a descriptive within-person self-pilot summary. ENOUGH metrics are prototype/product metrics; this page does not establish clinical efficacy, diagnosis, or causality.</p>
  <div class="summary-foot">Generated locally by ENOUGH v1.5 · ${new Date().toLocaleDateString()}</div></div>`;
}
function printResearchSummary(){
  let old=document.body.innerHTML;
  document.body.innerHTML=researchSummaryHTML();
  window.print();
  document.body.innerHTML=old;
  render();
}

function discoverPattern(ds){if(ds.length<5)return {title:'Keep logging a little longer.',text:'ต้องมีอย่างน้อย 5 วันที่ปิดบันทึกก่อนจึงจะเริ่มสรุป pattern แบบง่ายได้',note:'ENOUGH จะไม่ตีความจากข้อมูลเพียง 1–2 วัน'};let low=ds.filter(x=>+x.sleep<7),ok=ds.filter(x=>+x.sleep>=7);let au=a=>a.length?a.reduce((s,x)=>s+(+x.urge||0),0)/a.length:0;let diff=au(low)-au(ok);if(low.length>=2&&ok.length>=2&&Math.abs(diff)>=.4)return {title:diff>0?'Short-sleep days coincided with higher urge.':'Urge was not higher on short-sleep days.',text:`ในข้อมูล ${ds.length} วันที่ผ่านมา วันนอน <7 ชม. มี urge เฉลี่ย ${au(low).toFixed(1)}/5 เทียบกับ ${au(ok).toFixed(1)}/5 ในวันที่นอน ≥7 ชม.`,note:'Observed association in your own data — not proof that sleep caused the change.'};let high=ds.filter(x=>+x.stress>=4),oe=high.filter(x=>calc(x).oe).length;return {title:'Stress and stopping are worth watching together.',text:`มี ${high.length} วันที่ stress ≥4/5 และ ${oe} วันในกลุ่มนั้นตรงกับ Overstudy Episode.`,note:'This is a descriptive pattern, not a diagnosis or causal conclusion.'}}
function weeklyReflection(){let last=S.reflections?.[S.reflections.length-1];return `<div class="field"><label>What helped you stop when today was enough?</label><textarea id="wrHelp">${esc(last?.help||'')}</textarea></div><div class="field"><label>What made stopping difficult?</label><textarea id="wrHard">${esc(last?.hard||'')}</textarea></div><div class="field"><label>One adjustment for next week</label><textarea id="wrNext">${esc(last?.next||'')}</textarea></div><button class="btn primary" onclick="saveReflection()">Save weekly reflection</button>`}
function saveReflection(){let r={date:keyDate(),help:document.getElementById('wrHelp').value,hard:document.getElementById('wrHard').value,next:document.getElementById('wrNext').value};S.reflections=S.reflections||[];S.reflections.push(r);save();alert('Weekly reflection saved.');render()}
function lineChart(vals,suffix){if(!vals.length)return'';let w=520,h=180,p=20,max=Math.max(...vals),min=Math.min(...vals),span=max-min||1;let pts=vals.map((v,i)=>`${p+i*(w-2*p)/Math.max(1,vals.length-1)},${h-p-(v-min)*(h-2*p)/span}`).join(' ');return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line class="axis" x1="20" y1="160" x2="500" y2="160"/><polyline class="line" points="${pts}"/>${vals.map((v,i)=>{let [x,y]=pts.split(' ')[i].split(',');return `<circle class="dot" cx="${x}" cy="${y}" r="3"><title>${v}${suffix}</title></circle>`}).join('')}</svg>`}

function demoPeople(){
 const dates=Array.from({length:30},(_,i)=>{let d=new Date('2026-08-31T12:00:00');d.setDate(d.getDate()+i);return d.toISOString().slice(0,10)});
 const mk=(type,planned,seed)=>dates.map((date,i)=>{let wave=Math.sin((i+seed)*.72),hard=[2,3,9,10,15,16,22,23].includes(i);let stress=Math.max(2,Math.min(5,Math.round(3+wave+(hard?1:0))));let urge=Math.max(2,Math.min(5,stress+(i%4===0?1:0)));let sleep=Math.max(5.8,Math.min(8.2,7.4-wave*.45-(hard?.7:0)));let extra=(urge>=4&&hard)?(30+(i%3)*30):(i%5===0?-30:0);let actual=Math.max(60,planned+extra);let reason=(actual>planned&&urge>=4)?'Anxiety/fear of stopping':(extra>0?'Still productive':'Did not continue');return {date,person:type,planned,actual,sleep:+sleep.toFixed(1),meals:sleep<6.7?2:3,caffeine:hard?3:2,stress,energy:Math.max(1,6-stress),urge,met:'Yes',reason,done:'Synthetic demo day '+(i+1),wait:'Tomorrow',need:urge>=4?'Just stay':'Nothing today',partnerResponse:urge>=4?'I’m here 🤍':''}});
 return {full:mk('Full-day study',420,1),mixed:mk('Work/class + study',240,3)};
}
function personSummary(ds){let ms=ds.map(calc),avg=k=>ms.reduce((a,x)=>a+(x[k]??0),0)/ms.length,raw=k=>ds.reduce((a,x)=>a+(+x[k]||0),0)/ds.length;return {ebi:avg('ebi'),oe:ms.reduce((a,x)=>a+x.oe,0),ss:ms.reduce((a,x)=>a+x.ss,0),rd:ms.reduce((a,x)=>a+x.rd,0),sleep:raw('sleep'),study:raw('actual'),stress:raw('stress'),fla:avg('fla')*100,aag:(()=>{let z=ms.filter(x=>x.aag!==null);return z.length?z.reduce((a,x)=>a+x.aag,0)/z.length:0})()}}
function together(){let demo=demoPeople(),a=personSummary(demo.full),b=personSummary(demo.mixed);let rows=demo.full.map((x,i)=>({date:x.date,a:+x.actual,b:+demo.mixed[i].actual}));return `<section class="hero"><div class="label">Anonymous example patterns</div><h1>Two routines. No identity. No leaderboard.</h1><p>ตัวอย่างเปรียบเทียบคนที่มีเวลาอ่านหนังสือเต็มวัน กับคนที่ต้องเรียนหรือทำงานควบคู่กับการอ่าน เพื่อแสดงว่า ENOUGH ไม่ใช้จำนวนชั่วโมงเดียวตัดสินทุกคน</p><span class="demo-badge">SYNTHETIC · ANONYMOUS EXAMPLES</span></section><div class="compare-grid">${personBox('Pattern A','Full-day study',a)}${personBox('Pattern B','Class / work + study',b)}</div><div class="grid" style="margin-top:16px"><div class="card full"><div class="label">Daily study minutes — 30-day example</div>${dualLineChart(rows)}<div class="legend-note">ชั่วโมงของสองรูปแบบไม่ควรเท่ากัน เพราะภาระประจำวันและ finish line ต่างกัน จุดที่ดูคือการอ่านสัมพันธ์กับแผน การพัก และ urge อย่างไร</div></div><div class="card"><div class="label">Overstudy episodes</div><div class="metric"><span>Pattern A</span><b>${a.oe}</b></div><div class="metric"><span>Pattern B</span><b>${b.oe}</b></div></div><div class="card"><div class="label">Finish-line adherence</div><div class="metric"><span>Pattern A</span><b>${a.fla.toFixed(0)}%</b></div><div class="metric"><span>Pattern B</span><b>${b.fla.toFixed(0)}%</b></div></div><div class="card full"><div class="label">Privacy by design</div><p>ตัวอย่างนี้ไม่ใช้ชื่อบุคคล และข้อมูลจริงใน Support view ควรแชร์เฉพาะสิ่งที่ผู้ใช้เลือก เช่น support request ไม่เปิด private diary, treatment information หรือ stress/urge รายวันโดยอัตโนมัติ</p></div></div>`}
function personBox(code,label,m){return `<div class="person-card"><div class="label">${code}</div><h2>${label}</h2><div class="mini-grid"><div class="mini-stat"><b>${m.ebi.toFixed(0)}</b>EBI</div><div class="mini-stat"><b>${m.study.toFixed(0)}</b>min/day</div><div class="mini-stat"><b>${m.sleep.toFixed(1)}</b>sleep h</div><div class="mini-stat"><b>${m.stress.toFixed(1)}</b>stress /5</div><div class="mini-stat"><b>${m.oe}</b>overstudy</div><div class="mini-stat"><b>${m.aag.toFixed(2)}</b>AAG</div></div></div>`}
function dualLineChart(rows){let vals=rows.flatMap(r=>[r.a,r.b]),w=700,h=210,pad=24,max=Math.max(...vals),min=Math.min(...vals),span=max-min||1;let pts=k=>rows.map((r,i)=>`${pad+i*(w-2*pad)/(rows.length-1)},${h-pad-(r[k]-min)*(h-2*pad)/span}`).join(' ');return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line class="axis" x1="24" y1="186" x2="676" y2="186"/><polyline class="line" points="${pts('a')}"/><polyline class="line" points="${pts('b')}" style="opacity:.45;stroke-dasharray:7 5"/></svg><div class="metric"><span>Pattern A — full-day study · solid</span><span>Pattern B — class/work + study · dashed</span></div>`}

function history(){let ds=S.days.slice().sort((a,b)=>b.date.localeCompare(a.date));return `<section class="hero"><div class="label">History</div><h1>Your days, without a leaderboard.</h1><p>แตะวันที่เพื่อโหลดกลับมาแก้ไขได้</p></section><div class="history">${ds.length?ds.map(d=>{let m=calc(d);return `<div class="day" onclick="editDay('${d.date}')"><b>${d.date}</b><div><b>${d.actual} min</b> · sleep ${d.sleep}h · stress ${d.stress}/5<br><small>${esc(d.done||'No DONE TODAY note')}</small></div><span class="tag ${m.oe?'warn':''}">${m.oe?'Overstudy':m.ss?'Successful stop':m.rd?'Recovery day':'Routine'}</span></div>`}).join(''):`<div class="empty">No logged days yet.</div>`}</div>`}
function editDay(date){let d=S.days.find(x=>x.date===date);if(d){S.today=structuredClone(d);save();go('today')}}
function partner(){let d=S.today;let sent=(S.supportInbox||[]).slice(-5).reverse();return `<section class="hero"><div class="label">Support request</div><h1>Ask for the kind of help you want.</h1><p>ส่งเฉพาะคำขอที่เลือก ไม่จำเป็นต้องส่งคะแนน stress, urge หรือบันทึกส่วนตัว</p></section><div class="grid"><div class="card"><div class="label">Choose support</div>${['Just stay','Encourage me','Help me plan','Listen only','Call me','Remind me to stop','I need space'].map(x=>`<div class="metric"><span>${x}</span><button class="btn" onclick="sendSupport('${x}')">Send</button></div>`).join('')}</div><div class="card"><div class="label">Demo support inbox</div>${sent.length?sent.map(x=>`<div class="support-msg"><b>${esc(x.need)}</b><small>${esc(x.time)}</small><div>${esc(x.response||'Waiting for response')}</div></div>`).join(''):'<div class="empty">No support request sent yet.</div>'}<div class="notice">Private by default: no diary · no treatment info · no automatic stress/urge sharing</div></div></div>`}
function sendSupport(need){S.today.need=need;S.supportInbox=S.supportInbox||[];S.supportInbox.push({need,time:new Date().toLocaleString(),response:need==='I need space'?'Got it. I’ll give you space.':'I’m here. No fixing unless you ask.'});save();render()}

function settings(){let mode=S.profile.studyMode==='full'?'อ่านหนังสือเต็มวัน':'เรียน/ทำงาน + อ่านหนังสือ';return `<section class="hero"><div class="label">Settings</div><h1>Your data stays yours.</h1><p>ปรับโปรไฟล์ รูปแบบชีวิต และข้อมูลที่คุณเลือกแชร์ได้ทุกเมื่อ</p></section><div class="grid"><div class="card"><div class="label">Profile</div><div class="field"><label>Name</label><input value="${esc(S.profile.name)}" oninput="S.profile.name=this.value;save()"></div><div class="field"><label>Age</label><input type="number" value="${esc(S.profile.age)}" oninput="S.profile.age=this.value;save()"></div><div class="field"><label>Current routine</label><select onchange="S.profile.studyMode=this.value;save();render()"><option value="full" ${S.profile.studyMode==='full'?'selected':''}>📚 อ่านหนังสือเต็มวัน</option><option value="mixed" ${S.profile.studyMode==='mixed'?'selected':''}>💼 เรียน/ทำงาน + อ่านหนังสือ</option></select></div><div class="field"><label>Personal goal</label><input value="${esc(S.profile.goal)}" oninput="S.profile.goal=this.value;save()"></div><div class="profile-chip">${mode}</div></div><div class="card"><div class="label">Research Pilot</div><div class="metric"><span>Anonymous ID</span><b>${esc(S.profile.participantId||'—')}</b></div><div class="metric"><span>Mode</span><b>${S.profile.researchMode==='self'?'Self-pilot 28d':'Demo'}</b></div><div class="metric"><span>Current phase</span><b>${phaseFor(keyDate())}</b></div><div class="metric"><span>Pilot day</span><b>${S.profile.researchMode==='self'?Math.min(pilotDay(),28)+'/28':'—'}</b></div><div class="notice">Baseline 7 วัน → ENOUGH 21 วัน. การแบ่ง phase นี้ใช้สำหรับ self-pilot/development และไม่ได้ทำให้ผลลัพธ์เป็นหลักฐาน efficacy โดยอัตโนมัติ</div></div><div class="card"><div class="label">Research / backup</div><p>Export CSV มีเฉพาะวันที่ปิดบันทึก และ metric ที่คำนวณได้ เหมาะสำหรับ self-pilot analysis</p><div class="actions"><button class="btn primary" onclick="exportCSV()">Export research dataset</button><button class="btn" onclick="exportPrivateCSV()">Export private text separately</button><button class="btn" onclick="exportJSON()">Backup JSON</button><label class="btn">Import JSON<input type="file" accept="application/json" hidden onchange="importJSON(this.files[0])"></label><button class="btn danger" onclick="resetAll()">Erase all local data</button></div></div><div class="card full"><div class="label">Privacy & metric status</div><p>หน้า Together ใช้ข้อมูลจำลองแบบไม่ระบุตัวตน: Full-day study เทียบกับ Class/work + study โดยไม่ปนกับข้อมูล self-pilot จริง</p><p><b>OE, SS, RD, FLA, AAG, EBI</b> เป็น prototype/product metrics ไม่ใช่คะแนนวินิจฉัยสุขภาพจิต</p></div></div>`}
function startFocus(min){if(focusTimer)clearInterval(focusTimer);focusLeft=min*60;focusStartedAt=Date.now();tickFocus();focusTimer=setInterval(()=>{focusLeft--;tickFocus();if(focusLeft<=0){clearInterval(focusTimer);focusTimer=null;finishFocus(true)}},1000)}
function tickFocus(){let el=document.getElementById('focusStatus');if(!el)return;let m=Math.floor(focusLeft/60),s=focusLeft%60;el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function pauseFocus(){if(focusTimer){clearInterval(focusTimer);focusTimer=null;let el=document.getElementById('focusStatus');if(el)el.textContent+=' · paused'}}
function finishFocus(auto=false){if(!focusStartedAt)return;let elapsed=Math.max(1,Math.round((Date.now()-focusStartedAt)/60000));if(focusTimer)clearInterval(focusTimer);focusTimer=null;let task=document.getElementById('focusTask')?.value||'Focus session';S.sessions=S.sessions||[];S.sessions.push({date:keyDate(),task,minutes:elapsed});S.today.actual=(+S.today.actual||0)+elapsed;focusStartedAt=null;focusLeft=0;save();if(!auto)alert(`${elapsed} minutes logged to today.`);render()}

function toggleTheme(){S.profile.theme=S.profile.theme==='dark'?'light':'dark';save();render()}
function exportCSV(){let hs=['participant_id','date','pilot_day','study_profile','phase','planned_min','actual_min','study_deviation','sleep_h','meals','caffeine','stress','energy','urge','finish_line_met','continue_reason','need_partner','overstudy_episode','successful_stop','recovery_signal','recovery_day','sleep_protection','finish_line_adherence','aag','ebi'];let rows=S.days.map(d=>{let m=calc(d);return [S.profile.participantId,d.date,pilotDay(d.date),S.profile.studyMode,d.phase||phaseFor(d.date),d.planned,d.actual,(+d.actual||0)-(+d.planned||0),d.sleep,d.meals,d.caffeine,d.stress,d.energy,d.urge,d.met,d.reason,d.need,m.oe,m.ss,m.rs,m.rd,m.sp,m.fla,m.aag??'',m.ebi]});download('enough-research-dataset.csv',[hs,...rows].map(r=>r.map(csv).join(',')).join('\n'),'text/csv')}
function exportPrivateCSV(){let hs=['participant_id','date','done_today','what_can_wait','partner_response'];let rows=S.days.map(d=>[S.profile.participantId,d.date,d.done,d.wait,d.partnerResponse]);download('enough-private-text-separate.csv',[hs,...rows].map(r=>r.map(csv).join(',')).join('\n'),'text/csv')}
function csv(x){return `"${String(x??'').replaceAll('"','""')}"`}
function exportJSON(){download('enough-backup.json',JSON.stringify(S,null,2),'application/json')}
function download(n,c,t){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:t}));a.download=n;a.click();URL.revokeObjectURL(a.href)}
function importJSON(f){if(!f)return;let r=new FileReader();r.onload=()=>{try{S=JSON.parse(r.result);save();render();alert('Imported')}catch{alert('Invalid backup file')}};r.readAsText(f)}
function resetAll(){if(confirm('Erase all ENOUGH data stored in this browser?')){localStorage.removeItem(K);S=structuredClone(defaultState);onboardingMode='full';render()}}
render();
