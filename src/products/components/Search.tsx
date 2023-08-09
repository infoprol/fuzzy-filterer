"use client"

import { usePaginatedQuery } from "@blitzjs/rpc"

import { ChangeEvent, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from "react"
import { useRouterQuery } from "@blitzjs/next"
// import "swiper/css"
// import "swiper/css/effect-coverflow"
// import "swiper/css/pagination"
// import "swiper/css/navigation"
//import { SwiperOptions } from "swiper/types"
import { motion, AnimatePresence } from "framer-motion"

import useOutsideClick from "src/lib/hooks/useOutsideClick"
import getProducts from "../queries/getProducts"
import { useRouter } from "next/navigation"
import styles from "./Search.module.css"
import ProductCard from "./ProductCard"
import Tags from "./Tags"
import { Product } from "../types"

const SearchBar = ({ setProducts }) => {
  const router = useRouter()

  const qry = useRouterQuery()

  const [suggestionsOpen, setSuggestionsOpen] = useState<boolean>(false)
  const searchBarRef = useRef(null)
  useOutsideClick(searchBarRef, () => setSuggestionsOpen(false))

  const [qryArgs, setQryArgs] = useState<{ query: string; tags: string[] }>({
    query: qry["query"] !== undefined ? (qry["query"] as string) : "",
    tags: qry["tags"] !== undefined ? [qry["tags"] as string] : [],
  })
  const searchText = qryArgs.query
  const [{ products, availableTags }] = usePaginatedQuery(getProducts, qryArgs)

  useEffect(() => setProducts(products), [products, setProducts])

  const toggleTag = useCallback(
    (tag: string) => {
      console.log(`tag ${tag} toggled!`)
      const newTags = qryArgs.tags.includes(tag)
        ? qryArgs.tags.filter((x) => x !== tag)
        : [...qryArgs.tags, tag]
      setQryArgs({
        ...qryArgs,
        query: "",
        tags: newTags,
      })
    },
    [qryArgs]
  )

  // )

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const qryTxt = event.target.value
      setQryArgs({
        ...qryArgs,
        query: qryTxt,
      })
      //setSearchText(event.target.value)
      setSuggestionsOpen(true)
    },
    [qryArgs]
  )

  const nameSuggests = products.map(({ id, name }) => ({
    text: name,
    onClick: async (e) => {
      await router.push(`/products/${id}`)
      //await router.push(Routes.ShowProductPage({ productId: id }))
    },
  }))
  const tagSuggests = qryArgs.tags.map((tag) => ({
    text: tag,
    onClick: async (e) => {
      console.log(`toggle tag ${tag}`)
      toggleTag(tag)
      setSuggestionsOpen(false)
    },
  }))

  const suggestions = !suggestionsOpen || searchText === "" ? [] : nameSuggests.concat(tagSuggests)

  const handleSearchInputKeys: KeyboardEventHandler<HTMLElement> = (evt) => {
    switch (evt.key) {
      case "Escape":
      case "Enter":
        setSuggestionsOpen(false)
        break
      //TODO keydown, keyup for selecting suggestions with keyboard
      default:
        setSuggestionsOpen(true)
        break
    }
  }

  return (
    <div>
      <Tags tags={availableTags} activeTags={qryArgs.tags} toggleTag={toggleTag} />
      <div className={styles.searchContainer}>
        <div className={styles.searchBar} ref={searchBarRef}>
          <input
            type="text"
            placeholder="search..."
            className={styles.searchInput}
            onChange={handleSearch}
            value={searchText}
            onKeyDown={handleSearchInputKeys}
          />
          <div className={styles.suggestionsContainer}>
            {suggestions.map((suggestion, indx) => (
              <div className={styles.suggestion} key={indx}>
                <span onClick={suggestion.onClick}>{suggestion.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// const swiperProps: SwiperProps = {
//   grabCursor: true,
//   effect: "coverflow",
//   centeredSlides: true,
//   loop: true,
//   slidesPerView: 3,
//   coverflowEffect: {
//     rotate: 0,
//     stretch: 0,
//     depth: 100,
//     modifier: 2.5,
//   },
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//   },
//   navigation: {
//     nextEl: ".swiper-button-next",
//     prevEl: ".swiper-button-prev",
//   },
//   modules: [EffectCoverflow, Pagination, Navigation],
// }

const SwiperResults = ({ products }) => {
  return <div>{products.map((x) => JSON.stringify(x))}</div>
}
//   const swiperElRef = useRef(null)
//   return (<swiper-container ref={swiperElRef} class=""></swiper-container>
//   //   <Swiper {...swiperProps} className="swiper_container">
//   //     {products.map((p, indx) => (
//   //       <SwiperSlide key={indx}>
//   //         <ProductCard product={p} />
//   //       </SwiperSlide>
//   //     ))}
//   //   </Swiper>
//   // </div>
// }

const FramerResults = ({ products }: { products: Product[] }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      <AnimatePresence>
        {products.map((p) => (
          <motion.div
            layout
            className={styles.productCardCell}
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, animation: "linear" }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

//const Search = ({ query, tags }: { query: string; tags: string[] }) => {
const Search = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [resultsKind, setResultsKind] = useState<string>("animate")

  return (
    <>
      <div className={styles.toastContainer}>
        <p>
          <strong>results style</strong>:
          <select onChange={(e) => setResultsKind(e.target.value)} value={resultsKind}>
            <option value="animate">animated results</option>
            <option value="swiper">swiper results</option>
          </select>
        </p>
      </div>

      <div>
        <SearchBar setProducts={setProducts} />
        {resultsKind === "animate" ? (
          <FramerResults products={products} />
        ) : (
          <SwiperResults products={products} />
        )}
      </div>
    </>
  )
}

export default Search
