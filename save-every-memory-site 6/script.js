const money = n => n.toLocaleString('en-US',{style:'currency',currency:'USD'});
const val = id => Math.max(0, Math.floor(Number(document.getElementById(id).value) || 0));
function tierRate(q, tiers) { for (const [max, rate] of tiers) if (q <= max) return rate; return tiers[tiers.length-1][1]; }
function updateEstimate() {
  const vhs = val('vhs') * 19.99;
  const hi8 = val('hi8') * 24.99;
  const silent = val('silent') * 0.49;
  const sound = val('sound') * 0.85;
  const photosQty = val('photos');
  const photos = photosQty ? photosQty * tierRate(photosQty, [[20,2.89],[75,2.25],[150,1.99],[500,0.99],[Infinity,0.55]]) : 0;
  const slidesQty = val('slides') + val('negatives');
  const slides = slidesQty ? slidesQty * tierRate(slidesQty, [[20,4.25],[75,3.99],[150,3.25],[500,2.50],[Infinity,1.25]]) : 0;
  const services = vhs + hi8 + silent + sound + photos + slides;
  const drive = document.getElementById('drive').checked ? 17.99 : 0;
  const subtotal = services + drive;
  const tax = Math.round(subtotal * 0.0725 * 100) / 100;
  document.getElementById('servicesTotal').textContent = money(services);
  document.getElementById('driveTotal').textContent = money(drive);
  document.getElementById('subtotal').textContent = money(subtotal);
  document.getElementById('tax').textContent = money(tax);
  document.getElementById('total').textContent = money(subtotal + tax);
}
document.querySelectorAll('.calc-fields input, #drive').forEach(el => el.addEventListener('input', updateEstimate));
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  const open = nav.classList.toggle('open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav').classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('quoteForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const summary = [...data.entries()].map(([k,v]) => `${k}: ${v}`).join('\n');
  const status = document.getElementById('formStatus');
  status.textContent = 'Your information is filled in and ready. The live site still needs a secure form-delivery connection before requests can be sent.';
  console.info('Quote request preview:\n' + summary);
});
updateEstimate();
