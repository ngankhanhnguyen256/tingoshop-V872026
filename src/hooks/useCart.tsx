import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

export type CartItem = { id: string; name: string; price: string; thumb?: string; qty: number };

type State = { items: CartItem[] };
type Action =
  | { type: "add"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; state: State };

const STORAGE_KEY = "tingo_cart_v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((i) => (i.id === action.item.id ? { ...i, qty: i.qty + qty } : i)),
        };
      }
      return { items: [...state.items, { ...action.item, qty }] };
    }
    case "remove":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "setQty":
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: Math.max(0, action.qty) } : i))
          .filter((i) => i.qty > 0),
      };
    case "clear":
      return { items: [] };
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

export function parsePrice(s: string): number {
  const digits = s.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function formatPrice(n: number): string {
  return n.toLocaleString("vi-VN") + "đ";
}

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const value = useMemo<Ctx>(
    () => ({
      items: state.items,
      count: state.items.reduce((n, i) => n + i.qty, 0),
      subtotal: state.items.reduce((n, i) => n + parsePrice(i.price) * i.qty, 0),
      addItem: (item, qty) => dispatch({ type: "add", item, qty }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      items: [] as CartItem[],
      count: 0,
      subtotal: 0,
      addItem: () => {},
      removeItem: () => {},
      setQty: () => {},
      clear: () => {},
    } satisfies Ctx;
  }
  return ctx;
}
