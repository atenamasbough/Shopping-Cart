function ElementBuilder(e){
    let self = this;
    this.element = document.createElement(e);
    this.text = function (input) {
        return self.element.textContent = input, self;
    };
    this.type = function (input) {
        return self.element.type = input, self;
    };
    this.appendTo = function (input) {
        return input instanceof ElementBuilder ? input.build().appendChild(self.element) : input.appendChild(self.element), self;
    };
    this.placeholder = function (input) {
        return self.element.placeholder = input, self;
    };
    this.hide = function () {
        return self.element.style.display = "none", this;
    };
    this.show = function () {
        return self.element.style.display = "block", this;
    };
    this.className = function (input) {
        return self.element.className = input, self;
    };
    this.onClick = function (input) {
        return self.element.onClick = input, self;
    };
    this.html = function (input) {
        return self.element.innerHTML = input, self;
    };
    this.value = function (input) {
        return self.element.value = input, self;
    };
    this.build = function () {
        return self.element;
    };
    this.width = function () {
        return self.element.width = input, self;
    };
    this.on = function (input, t) {
        return self.element.addEventListener(input, t), self;
    };
    this.getValue = function () {
        return self.element.value;
    };
    this.src = function (input) {
        return self.element.src = input, self;
    };
    this.dataset = function (input) {
        return self.element.dataset = input, self;
    };
}
const dataString = `
{
    "items": [
      {
        "sys": { "id": "1" },
        "fields": {
          "title": "queen panel bed",
          "price": 10.99,
          "image": { "fields": { "file": { "url": "./images/product-1.jpeg" } } }
        }
      },
      {
        "sys": { "id": "2" },
        "fields": {
          "title": "king panel bed",
          "price": 12.99,
          "image": { "fields": { "file": { "url": "./images/product-2.jpeg" } } }
        }
      },
      {
        "sys": { "id": "3" },
        "fields": {
          "title": "single panel bed",
          "price": 12.99,
          "image": { "fields": { "file": { "url": "./images/product-3.jpeg" } } }
        }
      },
      {
        "sys": { "id": "4" },
        "fields": {
          "title": "twin panel bed",
          "price": 22.99,
          "image": { "fields": { "file": { "url": "./images/product-4.jpeg" } } }
        }
      },
      {
        "sys": { "id": "5" },
        "fields": {
          "title": "fridge",
          "price": 88.99,
          "image": { "fields": { "file": { "url": "./images/product-5.jpeg" } } }
        }
      },
      {
        "sys": { "id": "6" },
        "fields": {
          "title": "dresser",
          "price": 32.99,
          "image": { "fields": { "file": { "url": "./images/product-6.jpeg" } } }
        }
      },
      {
        "sys": { "id": "7" },
        "fields": {
          "title": "couch",
          "price": 45.99,
          "image": { "fields": { "file": { "url": "./images/product-7.jpeg" } } }
        }
      },
      {
        "sys": { "id": "8" },
        "fields": {
          "title": "table",
          "price": 33.99,
          "image": { "fields": { "file": { "url": "./images/product-8.jpeg" } } }
        }
      }
    ]
  }
  `;
  class Product {
    constructor({ id: e, title: t, price: p, image: i }) {
        (this.id = e), (this.title = t), (this.price = p), (this.image = i);
    }
    render() {
        const e = new ElementBuilder("article").className("product"),
            t = new ElementBuilder("div").className("img-container").appendTo(e);
            new ElementBuilder("img").className("product-img").src(this.image).appendTo(t);
        const n = new ElementBuilder("button")
            .dataset({ id: this.id })
            .html('<i class="fas fa-shopping-cart"></i>Add to cart')
            .className("bag-btn")
            .appendTo(t)
            .on("click", () => {
                cart.add(this.id);
            });
        return new ElementBuilder("i").className("fas fa-shopping-cart").appendTo(n), new ElementBuilder("h3").text(this.title).appendTo(e), e.build();
    }
}
class ProductManager {
    constructor() {
        const data = JSON.parse(dataString);
        this.products = data.items.map((row) => new Product({ id: row.sys.id, title: row.fields.title, price: row.fields.price, image: row.fields.image.fields.file.url }));
    }
    render() {
        //recursive function
        const container = document.querySelector(".products-center");
        this.products.forEach((row) => {
            container.appendChild(row.render());
        });
    }
    get(input) {
        return this.products.find((row) => row.id === input);
    }
}
const manager = new ProductManager();
manager.render();
class CartItem {
    constructor({ productId: e, onInc: t, onDec: n }) {
        (this.productId = e), (this.quantity = 1), (this.product = manager.get(e)), (this.onInc = t), (this.onDec = n);
    }
    inc() {
        this.quantity++; // quantity + 1
    }
    dec() {
        return --this.quantity; // quantity - 1 
    }
    getPrice() {
        return this.product.price * this.quantity;
    }
    render() {
        const e = new ElementBuilder("div").className("cart-item");
        new ElementBuilder("img").src(this.product.image).appendTo(e);
        const t = new ElementBuilder("div").appendTo(e);
        new ElementBuilder("h4").text(this.product.title).appendTo(t),
        new ElementBuilder("h5").text(this.product.price).appendTo(t),
        new ElementBuilder("span").className("remove-item").dataset({ id: this.productId }).text("remove").appendTo(t);
        const n = new ElementBuilder("div").appendTo(e);
        return (
            new ElementBuilder("i")
                .dataset({ id: this.productId })
                .className("fas fa-chevron-up")
                .on("click", () => this.onInc(this.productId))
                .appendTo(n),
            new ElementBuilder("p").className("item-amount").text(this.quantity).appendTo(n),
            new ElementBuilder("i")
                .dataset({ id: this.productId })
                .className("fas fa-chevron-down")
                .on("click", () => this.onDec(this.productId))
                .appendTo(n),
            e.build()
        );
    }
}
class Cart {
    constructor({ cartContent: e, cartTotal: t, clearBtn: n, cartItemsTotalContainer: i }) {
        (this.open = !1), (this.items = []), (this.cartContent = e), (this.cartTotal = t), (this.clearBtn = n), (this.cartItemsTotalContainer = i);
    }
    toggle() {
        const e = document.querySelector(".cart-overlay"),
            t = document.querySelector(".cart");
        this.open ? (e.classList.remove("transparentBcg"), t.classList.remove("showCart"), (this.open = !1)) : (e.classList.add("transparentBcg"), t.classList.add("showCart"), (this.open = !0));
    }
    add(e) {
        const t = this.items.find((t) => t.productId === e);
        t ? t.inc() : this.items.push(new CartItem({ productId: e, onInc: this.inc.bind(this), onDec: this.dec.bind(this) })), this.render();
    }
    remove(e) {
        (this.items = this.items.filter((t) => t.productId !== e)), this.render();
    }
    inc(e) {
        const t = this.items.find((t) => t.productId === e);
        t && (t.inc(), this.render());
    }
    dec(e) {
        const t = this.items.find((t) => t.productId === e);
        if (t) {
            0 === t.dec() && this.remove(e), this.render();
        }
    }
    clear() {
        (this.items = []), this.toggle(), this.render();
    }
    render() {
        this.cartContent.innerHTML = "";
        let e = 0,
            t = 0;
        this.items.forEach((n) => {
            (e += n.getPrice()), (t += n.quantity), this.cartContent.appendChild(n.render());
        }),
            (this.cartTotal.textContent = e),
            (this.cartItemsTotalContainer.textContent = t);
    }
}
const cart = new Cart({
        cartContent: document.querySelector(".cart-content"),
        cartTotal: document.querySelector(".cart-total"),
        clearBtn: document.querySelector(".clear-cart"),
        cartItemsTotalContainer: document.querySelector(".cart-items"),
    }),
    cartBtn = document.querySelector(".cart-btn"),
    closeBtn = document.querySelector(".close-cart"),
    clearBtn = document.querySelector(".clear-cart");
clearBtn.addEventListener("click", () => cart.clear()), cartBtn.addEventListener("click", () => cart.toggle()), closeBtn.addEventListener("click", () => cart.toggle());


