import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'priceradar_basket_v1';

const loadSavedBasket = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return {
    items: [], // Array of { productKey, name, imageUrl, quantity: 1, offers: [...] }
    substituteDecisions: {} // key: `${storeId}_${productKey}` -> 'accepted' | 'excluded'
  };
};

const saveBasket = (state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: state.items,
        substituteDecisions: state.substituteDecisions
      })
    );
  } catch {
    // ignore
  }
};

const initialState = loadSavedBasket();

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      const product = action.payload; // product object with offers
      const existing = state.items.find((item) => item.productKey === product.productKey);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          productKey: product.productKey,
          name: product.name,
          imageUrl: product.imageUrl,
          brand: product.brand,
          category: product.category,
          unit: product.quantity,
          unitPriceFormatted: product.unitPriceFormatted,
          quantity: 1,
          offers: product.offers || []
        });
      }
      saveBasket(state);
    },

    updateQuantity: (state, action) => {
      const { productKey, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.productKey !== productKey);
      } else {
        const item = state.items.find((item) => item.productKey === productKey);
        if (item) item.quantity = quantity;
      }
      saveBasket(state);
    },

    removeFromBasket: (state, action) => {
      const productKey = action.payload;
      state.items = state.items.filter((item) => item.productKey !== productKey);
      // Clean up substitute decisions
      Object.keys(state.substituteDecisions).forEach((key) => {
        if (key.endsWith(`_${productKey}`)) {
          delete state.substituteDecisions[key];
        }
      });
      saveBasket(state);
    },

    setSubstituteDecision: (state, action) => {
      const { storeId, productKey, decision } = action.payload; // decision: 'accepted' | 'excluded'
      const key = `${storeId}_${productKey}`;
      state.substituteDecisions[key] = decision;
      saveBasket(state);
    },

    clearBasket: (state) => {
      state.items = [];
      state.substituteDecisions = {};
      saveBasket(state);
    }
  }
});

export const { addToBasket, updateQuantity, removeFromBasket, setSubstituteDecision, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;
