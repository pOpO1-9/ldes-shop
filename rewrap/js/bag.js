(function (global) {
  const KEY = "rewrap-bag-v1";
  const listeners = [];

  function catalog() {
    return global.REWRAP;
  }

  function productById(id) {
    return ((catalog() && catalog().products) || []).find(function (p) {
      return p.id === id;
    });
  }

  function read() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    global.localStorage.setItem(KEY, JSON.stringify(items));
    listeners.forEach(function (fn) {
      fn();
    });
  }

  function add(id, qty) {
    const n = Math.max(1, Math.min(5, Number(qty) || 1));
    const items = read();
    const row = items.find(function (r) {
      return r.id === id;
    });
    if (row) row.qty = Math.min(5, row.qty + n);
    else items.push({ id: id, qty: n });
    write(items);
  }

  function setQty(id, qty) {
    const n = Math.max(0, Math.min(5, Number(qty) || 0));
    let items = read();
    if (n === 0) {
      items = items.filter(function (r) {
        return r.id !== id;
      });
    } else {
      const row = items.find(function (r) {
        return r.id === id;
      });
      if (row) row.qty = n;
      else items.push({ id: id, qty: n });
    }
    write(items);
  }

  function remove(id) {
    write(
      read().filter(function (r) {
        return r.id !== id;
      })
    );
  }

  function lines() {
    return read()
      .map(function (r) {
        const product = productById(r.id);
        if (!product) return null;
        return {
          id: r.id,
          qty: r.qty,
          product: product,
          lineTotal: product.price * r.qty,
        };
      })
      .filter(Boolean);
  }

  function count() {
    return read().reduce(function (s, r) {
      return s + r.qty;
    }, 0);
  }

  function subtotal() {
    return lines().reduce(function (s, l) {
      return s + l.lineTotal;
    }, 0);
  }

  global.RewrapBag = {
    add: add,
    setQty: setQty,
    remove: remove,
    lines: lines,
    count: count,
    subtotal: subtotal,
    onChange: function (fn) {
      listeners.push(fn);
    },
  };
})(window);
