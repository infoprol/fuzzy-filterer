"use client"

import { ChangeEvent, KeyboardEventHandler, Suspense, startTransition, useCallback, useEffect, useRef, useState, useTransition } from "react"
// import "swiper/css"
// import "swiper/css/effect-coverflow"
// import "swiper/css/pagination"
// import "swiper/css/navigation"
//import { SwiperOptions } from "swiper/types"
import { motion, AnimatePresence } from "framer-motion"
import { useLazyQuery, useSuspenseQuery, gql, useQuery } from "@apollo/client"
//import { gql } from 'graphql-tag'
import useOutsideClick from "@/hooks/useOutsideClick"
import { useRouter } from "next/navigation"
import styles from "./Search.module.css"
import ProductCard from "./ProductCard"
import Tags from "./Tags"
import { Product } from "@/lib/types"


const SEARCH_QUERY = gql`
  query SearchProducts($searchText: String = "", $tags: [String] = []) {
    searchProducts(searchText: $searchText, tags: $tags) {
      id
      isActive
      price
      imageUrl
      about
      tags
      legacyId
    }
  }
`
 

type SetProductsType = (pp: Product[]) => void
const SearchBar = ({ setProducts, availableTags }: { setProducts:SetProductsType, availableTags: string[] }) => {
  console.log("\n\n\n\nHEY MATT MATT SEARCHBAR STARTING TO RENDER")
  const router = useRouter()

  const [suggestionsOpen, setSuggestionsOpen] = useState<boolean>(false)
  //const setSuggestionsOpen = (t:boolean) => console.log(`setSuggestionsOpen(${t}`)
  const searchBarRef = useRef(null)
  useOutsideClick(searchBarRef, () => setSuggestionsOpen(false))


  const [qryArgs, setQryArgs] = useState<{ searchText: string; tags: string[] }>({
    searchText: '',  //query ? (query as string) : "",
    tags: [],  //tags ? tags as string[] : [],
  })
  const { searchText, tags } = qryArgs
  //const suggestionsOpen = searchText !== ''
  
  const { data } = useSuspenseQuery(SEARCH_QUERY, {
    variables: {
      searchText,
      tags,
    }
  })
  
  console.log(`got data from useQuery: ${JSON.stringify({data},undefined, "\n")}`)

  //const { data } = { data: { searchProducts: [] } }
  //TODO fix these castes after codegen-ing the graphql types
  const { searchProducts:products } = data ? data as { searchProducts: Product[] } : { searchProducts:[] }

  

  console.log(`HEY HEY HEY MATT\n\n${JSON.stringify({products}, undefined, 2)}`)




  //useEffect(() => setProducts(products as Product[]), [products, setProducts])

 //const [isPending, startTransition] = useTransition()

  const toggleTag = 
    (tag: string) => {

      console.log(`tag ${tag} toggled!`)
     // startTr ansition(() => {


        console.log("\n\n\n\nHEY MATT MATT startTransition on setQryArgs STARTING TO RENDER")
        const newTags = qryArgs.tags.includes(tag)
          ? qryArgs.tags.filter((x) => x !== tag)
          : [...qryArgs.tags, tag]
        setQryArgs({
          ...qryArgs,
          searchText: "",
          tags: newTags,
        })

        //refetch({ variables: { searchText, tags } })

        console.log(`tag toggle transition complete for tag ${tag}.`)
    //  })
    }
  // )

  const handleSearch = //useCallback(

    (event: ChangeEvent<HTMLInputElement>) => {
      const searchText = event.target.value
      
      startTransition(() => {
        
        console.log("\n\n\n\nHEY MATT MATT setSuggestions on setQryArgs STARTING TO RENDER")

        setQryArgs({
          ...qryArgs,
          searchText,
        })

        setSuggestionsOpen(true)
    
        console.log("\n\n\n\nHEY MATT MATT startTransition on setQryArgs end end end ")
      })
    }
    
   //[qryArgs])

  const nameSuggests = products.map(({ id, name }) => ({
    text: name,
    onClick: () => {
      router.push(`/products/${id}`)
    },
  }))
  const tagSuggests = qryArgs.tags.map((tag) => ({
    text: tag,
    onClick: () => {
      console.log(`toggle tag ${tag}`)

      //ition(() => {

        console.log("\n\n\n\nHEY MATT MATT startTransition on toggletatg STARTING TO RENDER")
        toggleTag(tag)
        setSuggestionsOpen(false)

        console.log("\n\n\n\nHEY MATT MATT startTransition on starting tags tags")
     //})
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


  console.log("\n\n\n\nHEY MATT MATT SEARCHBAR returning jsx")
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
      </div>    </div>
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

const SwiperResults = ({products}:{ products:Product[] }) => {
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


export interface SearchProps { query: string; tags: string[], availableTags: string[] }
const Search = ({ query, tags, availableTags }:  SearchProps) => {
//const Search = () => {
  
console.log("\n\n\n\nHEY MATT MATT search (just search) STARTING TO RENDER")

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
        <Suspense>
        <SearchBar setProducts={setProducts} availableTags={availableTags} /></Suspense>
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
