'use client'

import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Product } from '@/lib/types'

const SearchResults = ({ products }: { products: Product[] }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}
    >
      <AnimatePresence>
        {products.map(p => (
          <motion.div
            layout
            className='flex flex-wrap w-1/4 p-4'
            layoutId={p.id}
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, animation: 'linear' }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default SearchResults
