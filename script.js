var params = new URLSearchParams(window.location.search);
var nama = params.get("to");

if (nama) {
  document.getElementById("namaTamu").textContent = nama;
}

function tampilToast(teks) {
  document.getElementById("isiToast").textContent = teks;
  var toastEl = document.getElementById("toastku");
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
}


var cover = document.getElementById("cover");
var tombolBuka = document.getElementById("bukaBtn");

tombolBuka.addEventListener("click", function () {
  cover.classList.add("buka");

  document.body.classList.remove("locked");

  setTimeout(function () {
    cover.style.display = "none";
  }, 800);

  if (nama) {
    tampilToast("Selamat datang, " + nama + "!");
  } else {
    tampilToast("Selamat datang di undangan kami!");
  }
});

var hariH = new Date("2026-12-20T08:00:00+07:00").getTime();
function hitungMundur() {
  var sekarang = new Date().getTime();
  var selisih = hariH - sekarang;

  if (selisih < 0) {
    selisih = 0;
  }

  var hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
  var jam = Math.floor((selisih / (1000 * 60 * 60)) % 24);
  var menit = Math.floor((selisih / (1000 * 60)) % 60);
  var detik = Math.floor((selisih / 1000) % 60);

  document.getElementById("d").textContent = hari;
  document.getElementById("h").textContent = jam;
  document.getElementById("m").textContent = menit;
  document.getElementById("s").textContent = detik;
}

hitungMundur();
setInterval(hitungMundur, 1000);

var form = document.getElementById("rsvpForm");
var kotakHasil = document.getElementById("hasil");
var dataUcapan = [];

if (localStorage.getItem("ucapan")) {
  dataUcapan = JSON.parse(localStorage.getItem("ucapan"));
}

function tampilkanUcapan() {

  kotakHasil.innerHTML = "";

  if (dataUcapan.length == 0) {
    kotakHasil.hidden = true;
    return;
  }

  kotakHasil.hidden = false;

  var judul = document.createElement("h3");
  judul.textContent = "Ucapan dan doa";
  kotakHasil.appendChild(judul);

  for (var i = 0; i < dataUcapan.length; i++) {
    var item = dataUcapan[i];

    var kotak = document.createElement("div");
    kotak.className = "ucapan";

    var namaEl = document.createElement("strong");
    namaEl.textContent = item.nama;

    var statusEl = document.createElement("small");
    statusEl.textContent = item.hadir + " (" + item.jumlah + " orang)";

    var pesanEl = document.createElement("p");
    pesanEl.textContent = item.pesan;

    kotak.appendChild(namaEl);
    kotak.appendChild(statusEl);
    kotak.appendChild(pesanEl);
    kotakHasil.appendChild(kotak);
  }
}

tampilkanUcapan();

form.addEventListener("submit", function (e) {
  e.preventDefault(); // supaya halaman tidak reload

  var namaIsi = document.getElementById("nama").value.trim();
  var hadir = document.getElementById("hadir").value;
  var jumlah = document.getElementById("jumlah").value;
  var pesan = document.getElementById("pesan").value.trim();

  if (namaIsi == "") {
    tampilToast("Nama harus diisi dulu ya.");
    return;
  }

  if (jumlah < 1 || jumlah > 5) {
    tampilToast("Jumlah tamu antara 1 sampai 5.");
    return;
  }

  if (pesan == "") {
    pesan = "(tidak ada ucapan)";
  }

  dataUcapan.unshift({
    nama: namaIsi,
    hadir: hadir,
    jumlah: jumlah,
    pesan: pesan
  });

  localStorage.setItem("ucapan", JSON.stringify(dataUcapan));
  tampilkanUcapan();

  var teksModal = "";
  if (hadir == "Hadir") {
    teksModal = "Terima kasih " + namaIsi + ", kami tunggu kehadiranmu di hari bahagia kami.";
  } else {
    teksModal = "Terima kasih " + namaIsi + ", doa restumu sangat berarti bagi kami.";
  }
  document.getElementById("isiModal").textContent = teksModal;

  var modalEl = document.getElementById("modalTerima");
  var modal = new bootstrap.Modal(modalEl);
  modal.show();

  form.reset();
});