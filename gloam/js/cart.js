(function (global) {
  const KEY = "gloam-cart-v1";
  const listeners = [];

  function store() {
    return global.GLOAM_STORE;
  }

  function productById(id) {
    const list = (store() && store().products) || [];
    return list.find(function (p) {
      return p.id === id;
    });
  }

  function read() {
    try {
      const raw = global.localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    global.localStorage.setItem(KEY, JSON.stringify(items));
    listeners.forEach(function (fn) {
      fn(items);
    });
  }

  function add(id, qty) {
    const n = Math.max(1, Math.min(5, Number(qty) || 1));
    const items = read();
    const found = items.find(function (row) {
      return row.id === id;
    });
    if (found) {
      found.qty = Math.min(5, found.qty + n);
    } else {
      items.push({ id: id, qty: n });
    }
    write(items);
    return items;
  }

  function setQty(id, qty) {
    const n = Math.max(0, Math.min(5, Number(qty) || 0));
    let items = read();
    if (n === 0) {
      items = items.filter(function (row) {
        return row.id !== id;
      });
    } else {
      const found = items.find(function (row) {
        return row.id === id;
      });
      if (found) found.qty = n;
      else items.push({ id: id, qty: n });
    }
    write(items);
    return items;
  }

  function remove(id) {
    write(
      read().filter(function (row) {
        return row.id !== id;
      })
    );
  }

  function clear() {
    write([]);
  }

  function lines() {
    return read()
      .map(function (row) {
        const product = productById(row.id);
        if (!product) return null;
        return {
          id: row.id,
          qty: row.qty,
          product: product,
          lineTotal: product.price * row.qty,
        };
      })
      .filter(Boolean);
  }

  function count() {
    return read().reduce(function (sum, row) {
      return sum + row.qty;
    }, 0);
  }

  function subtotal() {
    return lines().reduce(function (sum, line) {
      return sum + line.lineTotal;
    }, 0);
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  global.GloamCart = {
    productById: productById,
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    lines: lines,
    count: count,
    subtotal: subtotal,
    onChange: onChange,
  };
})(window);
