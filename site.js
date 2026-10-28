/* ============================================================
   SITE SETTINGS. Edit this block to update the whole website.
   ============================================================ */
var SITE = {
  donateUrl: "https://donorbox.org/dawoodbhai-legacy-project-3",
  email: "dawoodbhailegacyproject@gmail.com",

  // Tax status. Leave ein blank ("") to hide the tax line everywhere.
  ein: "",                 // e.g. "12-3456789"

  // December campaign
  campaignYear: 2026,
  goal: 7500,              // dollars
  raised: 0,               // update during December
  matchText: "",           // e.g. "Every gift matched up to $5,000, thanks to a generous family."

  // Families helped so far. Leave 0 to hide the line.
  familiesHelped: 11,

  // Names in the Remembrance Sky. Add one line per name a donor dedicates.
  remembered: [
    { name: "Baby D", note: "The first light", main: true }
  ]
};

(function(){
  function $(s,r){return (r||document).querySelector(s);}
  function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  function money(n){return "$"+Math.round(n).toLocaleString("en-US");}

  // Fill shared values
  $$("[data-donate]").forEach(function(a){
    var q=a.getAttribute("data-donate"); a.href=SITE.donateUrl+(q?("?"+q):""); a.target="_blank"; a.rel="noopener";
  });
  $$("[data-email]").forEach(function(e){e.textContent=SITE.email;});
  $$("[data-ein]").forEach(function(e){
    if(!SITE.ein){e.textContent="Donations are processed securely through Donorbox, which emails you a receipt for your records.";return;}
    e.textContent="The Dawoodbhai Legacy Project is a registered 501(c)(3) nonprofit. EIN "+SITE.ein+". Gifts are tax-deductible to the extent allowed by law.";
  });
  $$("[data-families]").forEach(function(e){
    if(!SITE.familiesHelped){e.hidden=true;return;}
    var n=$("b",e); if(n) n.textContent=SITE.familiesHelped.toLocaleString("en-US");
  });
  $$("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear();});

  // Poem: show only once text has been pasted in
  $$(".poem-lines").forEach(function(q){
    var t=q.textContent.replace(/^\s+|\s+$/g,"");
    var band=q.closest(".poem-band");
    if(!t){ if(band) band.hidden=true; return; }
    q.textContent=t;
  });

  // Mobile menu
  var nav=$(".nav"), mb=$(".menu-btn");
  if(mb){mb.addEventListener("click",function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o?"true":"false");mb.textContent=o?"Close":"Menu";});}

  // 40-week line
  var dots=$("#dots");
  if(dots){for(var i=1;i<=40;i++){var s=document.createElement("span");s.className="dot"+(i<26?" lived":i===26?" born":"");s.title="Week "+i;dots.appendChild(s);}}

  // December campaign meter
  var meter=$("#meter");
  if(meter){
    var start=new Date(SITE.campaignYear,11,1), end=new Date(SITE.campaignYear,11,31,23,59), now=new Date(), DAY=864e5;
    var pct=Math.min(100,SITE.goal?SITE.raised/SITE.goal*100:0);
    $("#raised").textContent=money(SITE.raised);
    $("#goal").textContent="raised of "+money(SITE.goal)+" goal";
    var status;
    if(now<start){var d=Math.ceil((start-now)/DAY);status="Opens December 1 · "+d+" day"+(d===1?"":"s")+" to go";}
    else if(now<=end){var l=Math.ceil((end-now)/DAY);status=l+" day"+(l===1?"":"s")+" left to give";}
    else {status="Thank you. This year's fund is at work.";}
    $("#status").textContent=status;
    requestAnimationFrame(function(){ $("#bar").style.width=Math.max(pct,SITE.raised?2:0)+"%"; });
    var m=$("#match"); if(m){ if(SITE.matchText){m.querySelector("span").textContent=SITE.matchText;} else m.hidden=true; }
  }

  // Starfields (hero + sky)
  var still=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function starfield(c,density){
    var x=c.getContext("2d"),st=[],dpr=Math.min(window.devicePixelRatio||1,2);
    function size(){var r=c.getBoundingClientRect();c.width=r.width*dpr;c.height=r.height*dpr;st=[];var n=Math.round(r.width*r.height/density);
      for(var i=0;i<n;i++)st.push({x:Math.random()*c.width,y:Math.random()*c.height,r:(Math.random()*1.1+.3)*dpr,p:Math.random()*6.28,s:.004+Math.random()*.01});draw(0);}
    function draw(t){x.clearRect(0,0,c.width,c.height);for(var i=0;i<st.length;i++){var o=st[i],a=.22+.45*(0.5+0.5*Math.sin(o.p+t*o.s));x.fillStyle="rgba(233,220,190,"+a.toFixed(3)+")";x.beginPath();x.arc(o.x,o.y,o.r,0,6.283);x.fill();}}
    function loop(t){draw(t/16);requestAnimationFrame(loop);}
    size();window.addEventListener("resize",size);if(!still)requestAnimationFrame(loop);
  }
  $$("canvas.stars").forEach(function(c){starfield(c,+c.getAttribute("data-density")||9000);});

  // Remembrance Sky
  var sky=$("#sky");
  function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0);}
  function place(name,i){
    if(i===0) return {x:50,y:44};
    var h=hash(name+i); return {x:12+(h%7600)/100, y:16+((h>>>13)%6400)/100};
  }
  function addStar(item,i,cls){
    var p=place(item.name,i),el=document.createElement("div");
    el.className="star"+(item.main?" main":"")+(cls?" "+cls:"");
    el.style.left=p.x+"%";el.style.top=p.y+"%";
    el.innerHTML="<i></i><span></span>"+(item.note?"<small></small>":"");
    el.querySelector("span").textContent=item.name;
    if(item.note) el.querySelector("small").textContent=item.note;
    sky.appendChild(el);return el;
  }
  if(sky){
    SITE.remembered.forEach(function(it,i){addStar(it,i);});
    var inp=$("#skyName"),prev=null,form=$("#skyForm"),give=$("#skyGive");
    inp.addEventListener("input",function(){
      var v=inp.value.trim();
      if(prev){prev.remove();prev=null;}
      if(v){prev=addStar({name:v,note:"Your star (preview)"},SITE.remembered.length+7,"preview");}
    });
    form.addEventListener("submit",function(e){e.preventDefault();give.click();});
    give.addEventListener("click",function(){
      var v=inp.value.trim();
      $("#skyNote").textContent=v?("Thank you. In the donation form, choose “Dedicate this donation” and enter “"+v+"”. We will add their star to the sky."):"Thank you. Choose “Dedicate this donation” in the donation form to add a name.";
    });
  }

  // Mail forms (support request + newsletter) open an email to the team
  function mailForm(id,build){
    var f=document.getElementById(id); if(!f) return;
    var note=f.querySelector(".sent");
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var r=build(f); note.hidden=false;
      if(r.error){note.textContent=r.error;return;}
      var href="mailto:"+SITE.email+"?subject="+encodeURIComponent(r.subject)+"&body="+encodeURIComponent(r.body);
      note.innerHTML=r.thanks+' If your email app did not open, write to us at <span class="email-copy"><code></code> <button type="button" class="linkbtn">Copy address</button></span>';
      note.querySelector("code").textContent=SITE.email;
      note.querySelector("button").addEventListener("click",function(){var b=this;try{navigator.clipboard.writeText(SITE.email).then(function(){b.textContent="Copied";},function(){});}catch(_){}});
      window.location.href=href;
    });
  }
  var okEmail=function(v){return /^\S+@\S+\.\S+$/.test(v);};
  mailForm("supportForm",function(f){
    var fn=f.fname.value.trim(),em=f.email.value.trim(),ph=f.phone.value.trim(),msg=f.msg.value.trim();
    if(!fn||!okEmail(em)||!ph||!msg) return {error:"Please fill in your first name, email, phone number, and a short message so we can reach you."};
    var svc=(f.querySelector("input[name=service]:checked")||{}).value||"";
    var who=(f.querySelector("input[name=who]:checked")||{}).value||"";
    return {subject:"Support request: "+svc,
      body:"Name: "+fn+" "+f.lname.value.trim()+"\nEmail: "+em+"\nPhone: "+ph+"\nServices needed: "+svc+"\nReaching out as: "+who+"\n\n"+msg,
      thanks:"Thank you for reaching out. Your email app should open with your request ready to send, and a member of our team will contact you personally."};
  });
  mailForm("listForm",function(f){
    var em=f.lemail.value.trim();
    if(!okEmail(em)) return {error:"Please enter a valid email address."};
    return {subject:"Add me to the December remembrance list",body:"Please add "+em+" to the Dawoodbhai Legacy Project email list.",thanks:"Thank you. Your email app should open with your sign-up ready to send."};
  });
})();
