const packages=[
  {name:"Joki Kontak 3 Hari",price:"Rp2.000"},
  {name:"Joki Kontak 6 Hari",price:"Rp4.000"},
  {name:"Joki Kontak 8 Hari",price:"Rp5.000"},
  {name:"Joki Kontak 10 Hari",price:"Rp7.000"},
  {name:"Joki Kontak PERMANEN",price:"Rp10.000"}
];

const digital=[
  {name:"APK BUG GOJO CRASHER V2 X RAT",price:"Rp2.000"},
  {name:"APK AUTO SV",price:"Rp2.000"},
  {name:"PANEL UNLI",price:"Rp10.000"},
  {name:"FILE AUTO HS 70%",price:"Rp70.000"},
  {name:"JASA EDIT SPEK",price:"Rp1.000"},
  {name:"JASA BUAT LOGO JB",price:"Rp2.000"},
  {name:"MURPUSH",price:"Rp1.000"},
  {name:"NOKOS INDO",price:"Rp6.000"},
  {name:"FF KIPAS",price:"Rp3.000"}
];

let selected=null;
const $=id=>document.getElementById(id);

function renderPackages(){
  $("packageGrid").innerHTML=packages.map((p,i)=>`
    <div class="card ${selected===i?'selected':''}" onclick="selectPackage(${i})">
      <small>PAKET JOKI</small><h3>${p.name}</h3><div class="price">${p.price}</div>
      <button class="secondary">${selected===i?'✓ DIPILIH':'PILIH PAKET'}</button>
    </div>`).join("");
}
function selectPackage(i){
  selected=i;
  $("selectedPackage").textContent=`${packages[i].name} — ${packages[i].price}`;
  renderPackages();
  toast("Paket berhasil dipilih.");
}
function orderSelected(){
  if(selected===null){toast("Silahkan pilih paket terlebih dahulu.");return}
  showPage("payment");
}
function renderDigital(){
  $("digitalGrid").innerHTML=digital.map((p,i)=>`
    <div class="card">
      <small>DIGITAL STORE</small><h3>${p.name}</h3><div class="price">${p.price}</div>
      <button class="primary" onclick="orderDigital(${i})">ORDER</button>
    </div>`).join("");
}
function orderDigital(i){
  localStorage.setItem("lastOrder",digital[i].name);
  showPage("payment");
  toast("Produk dipilih. Silahkan lanjut ke pembayaran.");
}
function confirmPayment(){
  const proof=$("proof").value.trim();
  if(!proof){toast("Masukkan keterangan/link bukti transfer terlebih dahulu.");return}
  let history=JSON.parse(localStorage.getItem("history")||"[]");
  const order=selected!==null?packages[selected].name:(localStorage.getItem("lastOrder")||"Order Digital");
  history.unshift({name:order,date:new Date().toLocaleString("id-ID")});
  localStorage.setItem("history",JSON.stringify(history.slice(0,20)));
  $("proof").value="";
  localStorage.removeItem("lastOrder");
  renderHistory();
  showPage("joki");
  toast("Konfirmasi diterima. Silahkan lanjut proses joki.");
}
function renderHistory(){
  const h=JSON.parse(localStorage.getItem("history")||"[]");
  $("historyList").innerHTML=h.length?h.map(x=>`<div class="history-item"><b>${x.name}</b><span>${x.date}</span></div>`).join(""):`<p class="muted">Belum ada riwayat pembelian.</p>`;
}
function changeName(){
  const n=prompt("Masukkan nama baru:",localStorage.getItem("profileName")||"RAFFSTR");
  if(n&&n.trim()){localStorage.setItem("profileName",n.trim());loadProfile();toast("Nama berhasil diubah.");}
}
function changePhoto(){
  const url=prompt("Masukkan URL foto profil:");
  if(url&&url.trim()){localStorage.setItem("avatarUrl",url.trim());loadProfile();toast("Foto profil diperbarui.");}
}
function loadProfile(){
  const n=localStorage.getItem("profileName")||"RAFFSTR";
  $("profileName").textContent=n;
  const url=localStorage.getItem("avatarUrl");
  $("avatar").style.backgroundImage=url?`url("${url}")`:"";
  $("avatar").style.backgroundSize="cover";
  $("avatar").style.backgroundPosition="center";
  $("avatar").textContent=url?"":n.charAt(0).toUpperCase();
}
function logout(){
  if(confirm("Yakin ingin logout?")){
    localStorage.removeItem("profileName");
    localStorage.removeItem("avatarUrl");
    toast("Logout berhasil.");
    setTimeout(()=>location.reload(),600);
  }
}
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  $(id).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
function toast(msg){
  const t=$("toast");t.textContent=msg;t.classList.add("show");
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200);
}

renderPackages();renderDigital();renderHistory();loadProfile();
setTimeout(()=>{$("loader").classList.add("hidden");$("app").classList.remove("hidden")},900);
