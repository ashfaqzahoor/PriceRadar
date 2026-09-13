import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice.js';
import { ProductImage } from './ProductImage.jsx';

export function SimilarProducts({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4 pt-4 border-t border-slate-200/80">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Similar Everyday Alternatives
          </h3>
          <p className="text-xs text-slate-500">Compare equivalent items in this category</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {products.map((item) => (
          <Link
            key={item.productKey}
            to={`/products/${encodeURIComponent(item.productKey)}`}
            className="group flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div>
              <div className="relative aspect-square w-full rounded-xl bg-slate-50/80 p-2 overflow-hidden flex items-center justify-center mb-2.5">
                <ProductImage src={item.imageUrl} alt={item.name} />
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                {item.quantity}
              </span>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors mt-0.5">
                {item.name}
              </h4>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Lowest</span>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {formatPrice(item.bestOffer?.price)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                Compare &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
