
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');
hamburger.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));


const sections = document.querySelectorAll('section[id], div[id="footer"]');
const navLinks  = document.querySelectorAll('nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current || (current === 'home' && a.getAttribute('href') === '#')) {
      a.classList.add('active');
    }
  });
});


let cart = [];

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString('en-IN');

  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');

  if (cart.length === 0) {
    emptyEl.style.display = 'block';
    itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
    return;
  }
  emptyEl.style.display = 'none';

  itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}"/>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="ci-price">₹${item.price.toLocaleString('en-IN')} × ${item.qty}</div>
      </div>
      <button class="remove-item" data-idx="${idx}">🗑</button>
    `;
    itemsEl.appendChild(div);
  });

  itemsEl.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.splice(+btn.dataset.idx, 1);
      updateCartUI();
    });
  });
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', function() {
    const name  = this.dataset.name;
    const price = parseInt(this.dataset.price);
    const img   = this.dataset.img;

    const existing = cart.find(i => i.name === name);
    if (existing) { existing.qty++; }
    else { cart.push({ name, price, img, qty: 1 }); }

    // button feedback
    const orig = this.textContent;
    this.textContent = '✓ Added!';
    this.classList.add('added');
    setTimeout(() => { this.textContent = orig; this.classList.remove('added'); }, 1500);

    // count bump
    const cc = document.getElementById('cartCount');
    cc.classList.add('bump');
    setTimeout(() => cc.classList.remove('bump'), 300);

    updateCartUI();
    openCartSidebar();
  });
});


function openCartSidebar() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCartSidebar() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}
document.getElementById('openCart').addEventListener('click', openCartSidebar);
document.getElementById('closeCart').addEventListener('click', closeCartSidebar);
document.getElementById('cartOverlay').addEventListener('click', closeCartSidebar);


document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


document.querySelectorAll('.toggle-details').forEach(btn => {
  btn.addEventListener('click', function() {
    const details = this.nextElementSibling;
    details.classList.toggle('open');
    this.textContent = details.classList.contains('open') ? '▴ Hide Details' : '▾ View Details';
  });
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fname = document.getElementById('fname').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('message').value.trim();
  if (!fname || !email || !msg) {
    alert('⚠️ Please fill in all required fields (marked with *).');
    return;
  }
  document.getElementById('formSuccess').classList.add('show');
  this.reset();
  setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 5000);
});


const scrollBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
updateCartUI();
