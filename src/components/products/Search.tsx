"use client";

import {
  ChangeEvent,
  KeyboardEventHandler,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
// import "swiper/css"
// import "swiper/css/effect-coverflow"
// import "swiper/css/pagination"
// import "swiper/css/navigation"
//import { SwiperOptions } from "swiper/types"
import { motion, AnimatePresence } from "framer-motion";

import useOutsideClick from "@/hooks/useOutsideClick";
import { useRouter } from "next/navigation";
import styles from "./Search.module.css";
import ProductCard from "./ProductCard";
import Tags from "./Tags";
import { Product } from "@/lib/types";

export interface SearchArgsType {
  searchText: string;
  tags: string[];
}

const SearchBar = (props: SearchPropsType) => {
  //
  const router = useRouter();
  //
  //   const qry = useRouterQuery()
  //

  const { availableTags, products } = props;

  const [qryArgs, setQryArgs] = useState<SearchArgsType>({
    searchText: props.searchText,
    tags: props.tags,
  });

  const { searchText, tags } = qryArgs;

  const [suggestionsOpen, setSuggestionsOpen] = useState<boolean>(false);
  const [currSelectedSuggestion, setCurrSelectedSuggestion] =
    useState<number>(-1);

  const searchBarRef = useRef(null);
  useOutsideClick(searchBarRef, () => setSuggestionsOpen(false));

  useEffect(() => {
    const debounced = setTimeout(() => {
      const { searchText, tags } = qryArgs;

      const qs = new URLSearchParams({
        searchText,
      });
      for (const t of tags) qs.append("tags", t);

      router.push(`/?${qs}`);
    }, 300);
  }, [qryArgs, router]);

  //
  //
  //   const [qryArgs, setQryArgs] = useState<{ query: string; tags: string[] }>({
  //     query: qry["query"] !== undefined ? (qry["query"] as string) : "",
  //     tags: qry["tags"] !== undefined ? [qry["tags"] as string] : [],
  //   })
  //   const searchText = qryArgs.query
  //   const [{ products, availableTags }] = usePaginatedQuery(getProducts, qryArgs)
  //
  //   useEffect(() => setProducts(products), [products, setProducts])

  const toggleTag = (tag: string) => {
    console.log(`tag ${tag} toggled!`);
    const newTags = tags.includes(tag)
      ? tags.filter((x) => x !== tag)
      : [...tags, tag];

    setQryArgs({
      searchText: "",
      tags: newTags,
    });
  };
  // )

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setQryArgs({
      tags,
      searchText,
    });
    //setSearchText(event.target.value)
    //setSuggestionsOpen(true)
  };

  const nameSuggests = products.map(({ id, name }, indx) => {
    const h: KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (currSelectedSuggestion !== indx) return;

      switch (event.key) {
        case "Enter":
          alert(`${id} => ${name}`);
          break;

        case "ArrowDown":
          setCurrSelectedSuggestion(indx + (1 % products.length));
          break;

        case "ArrowUp":
          setCurrSelectedSuggestion(indx - (1 % products.length));

        default:
          break;
      }
    };

    return {
      text: name,
      onKeyDown: h,
      onClick: () => {
        router.push(`/products/${id}`);
        //await router.push(Routes.ShowProductPage({ productId: id }))
      },
    };
  });
  const tagSuggests = tags.map((tag) => ({
    text: tag,
    onKeyDown: (evt: KeyboardEvent) => {},

    onClick: () => {
      console.log(`toggle tag ${tag}`);
      toggleTag(tag);
      setSuggestionsOpen(false);
    },
  }));

  const suggestions = !suggestionsOpen || searchText === "" ? [] : nameSuggests; //.concat(tagSuggests);

  const handleSearchInputKeys: KeyboardEventHandler<HTMLElement> = async (
    evt
  ) => {
    switch (evt.key) {
      case "Enter":
      case "Escape":
        setSuggestionsOpen(false);
        break;
      case "ArrowDown":
        setSuggestionsOpen(true);
        setCurrSelectedSuggestion(0);
        break;
      //TODO keydown, keyup for selecting suggestions with keyboard
      default:
        setSuggestionsOpen(true);
        break;
    }
  };

  const handleSuggestionKeyboardNavigation: KeyboardEventHandler<
    HTMLElement
  > = async () => {};

  return (
    <div>
      <Tags tags={availableTags} activeTags={tags} toggleTag={toggleTag} />
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
              <div
                className={styles.suggestion}
                key={indx}
                onKeyDown={suggestion.onKeyDown}
                onClick={suggestion.onClick}
              >
                <span
                  onKeyDown={suggestion.onKeyDown}
                  onClick={suggestion.onClick}
                >
                  {suggestion.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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

const SwiperResults = ({ products }: { products: Product[] }) => {
  return <div>{products.map(({ id }) => JSON.stringify({ id }))}</div>;
};
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
            layoutId={p.id}
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
  );
};

export interface SearchPropsType extends SearchArgsType {
  availableTags: string[];
  products: Product[];
}

const Search = (props: SearchPropsType) => {
  const [resultsKind, setResultsKind] = useState<string>("animate");
  const { products } = props;

  return (
    <>
      <div className={styles.toastContainer}>
        <p>
          <strong>results style</strong>:
          <select
            onChange={(e) => setResultsKind(e.target.value)}
            value={resultsKind}
          >
            <option value="animate">animated results</option>
            <option value="swiper">swiper results</option>
          </select>
        </p>
      </div>

      <div>
        <SearchBar {...props} />

        {resultsKind === "animate" ? (
          <FramerResults products={products} />
        ) : (
          <SwiperResults products={products} />
        )}
      </div>
    </>
  );
};

export default Search;

// "use client"
//
// import { ChangeEvent, KeyboardEventHandler, RefObject, Suspense,
// createRef, startTransition, useCallback, useEffect, useRef, useState, useTransition } from "react"
// // import "swiper/css"
// // import "swiper/css/effect-coverflow"
// // import "swiper/css/pagination"
// // import "swiper/css/navigation"
// //import { SwiperOptions } from "swiper/types"
// import { motion, AnimatePresence } from "framer-motion"
// import { useLazyQuery, useSuspenseQuery, gql, useQuery } from "@apollo/client"
// //import { gql } from 'graphql-tag'
// import useOutsideClick from "@/hooks/useOutsideClick"
// import { useRouter } from "next/navigation"
// import styles from "./Search.module.css"
// import ProductCard from "./ProductCard"
// import Tags from "./Tags"
// import { Product } from "@/lib/types"
//
//
// const SEARCH_QUERY = gql`
//   query SearchProducts($searchText: String = "", $tags: [String] = []) {
//     searchProducts(searchText: $searchText, tags: $tags) {
//       id
//       isActive
//       price
//       imageUrl
//       name
//       about
//       tags
//       legacyId
//     }
//   }
// `
//
//
// type SetProductsType = (pp: Product[]) => void
// const SearchBar = ({ setProducts, availableTags }: { setProducts:SetProductsType, availableTags: string[] }) => {
//   console.log("\n\n\n\nHEY MATT MATT SEARCHBAR STARTING TO RENDER")
//   const router = useRouter()
//
//   const [suggestionsOpen, setSuggestionsOpen] = useState<boolean>(false)
//   //const setSuggestionsOpen = (t:boolean) => console.log(`setSuggestionsOpen(${t}`)
//   const searchBarRef: RefObject<HTMLDivElement> = createRef()
//   useOutsideClick(searchBarRef, () => setSuggestionsOpen(false))
//
//
//   const [qryArgs, setQryArgs] = useState<{ searchText: string; tags: string[] }>({
//     searchText: '',  //query ? (query as string) : "",
//     tags: [],  //tags ? tags as string[] : [],
//   })
//   const { searchText, tags } = qryArgs
//   //const suggestionsOpen = searchText !== ''
//
//   const { data } = useSuspenseQuery(SEARCH_QUERY, {
//     variables: {
//       searchText,
//       tags,
//     }
//   })
//
//   console.log(`got data from useQuery: ${JSON.stringify({data},undefined, "\n")}`)
//
//   //const { data } = { data: { searchProducts: [] } }
//   //TODO fix these castes after codegen-ing the graphql types
//   const { searchProducts:products } = data ? data as { searchProducts: Product[] } : { searchProducts:[] }
//
//
//
//   console.log(`HEY HEY HEY MATT\n\n${JSON.stringify({products}, undefined, 2)}`)
//
//
//
//
//   //useEffect(() => setProducts(products as Product[]), [products, setProducts])
//
//  //const [isPending, startTransition] = useTransition()
//
//   const toggleTag =
//     (tag: string) => {
//
//       console.log(`tag ${tag} toggled!`)
//      // startTr ansition(() => {
//
//
//         console.log("\n\n\n\nHEY MATT MATT startTransition on setQryArgs STARTING TO RENDER")
//         const newTags = qryArgs.tags.includes(tag)
//           ? qryArgs.tags.filter((x) => x !== tag)
//           : [...qryArgs.tags, tag]
//         setQryArgs({
//           ...qryArgs,
//           searchText: "",
//           tags: newTags,
//         })
//
//         //refetch({ variables: { searchText, tags } })
//
//         console.log(`tag toggle transition complete for tag ${tag}.`)
//     //  })
//     }
//   // )
//
//   const handleSearch = //useCallback(
//
//     (event: ChangeEvent<HTMLInputElement>) => {
//       const searchText = event.target.value
//
//       startTransition(() => {
//
//         console.log("\n\n\n\nHEY MATT MATT setSuggestions on setQryArgs STARTING TO RENDER")
//
//         setQryArgs({
//           ...qryArgs,
//           searchText,
//         })
//
//         setSuggestionsOpen(true)
//
//         console.log("\n\n\n\nHEY MATT MATT startTransition on setQryArgs end end end ")
//       })
//     }
//
//    //[qryArgs])
//
//   const nameSuggests = products.map(({ id, name }) => ({
//     text: name,
//     onClick: () => {
//       router.push(`/products/${id}`)
//     },
//   }))
//   const tagSuggests = qryArgs.tags.map((tag) => ({
//     text: tag,
//     onClick: () => {
//       console.log(`toggle tag ${tag}`)
//
//       //ition(() => {
//
//         console.log("\n\n\n\nHEY MATT MATT startTransition on toggletatg STARTING TO RENDER")
//         toggleTag(tag)
//         setSuggestionsOpen(false)
//
//         console.log("\n\n\n\nHEY MATT MATT startTransition on starting tags tags")
//      //})
//     },
//   }))
//
//   const suggestions = !suggestionsOpen || searchText === "" ? [] : nameSuggests.concat(tagSuggests)
//
//   const handleSearchInputKeys: KeyboardEventHandler<HTMLElement> = (evt) => {
//     switch (evt.key) {
//       case "Escape":
//       case "Enter":
//         setSuggestionsOpen(false)
//         break
//       //TODO keydown, keyup for selecting suggestions with keyboard
//       default:
//         setSuggestionsOpen(true)
//         break
//     }
//   }
//
//
//   console.log("\n\n\n\nHEY MATT MATT SEARCHBAR returning jsx")
//   return (
//     <div>
//       <Tags tags={availableTags} activeTags={qryArgs.tags} toggleTag={toggleTag} />
//       <div className={styles.searchContainer}>
//         <div className={styles.searchBar} ref={searchBarRef}>
//           <input
//             type="text"
//             placeholder="search..."
//             className={styles.searchInput}
//             onChange={handleSearch}
//             value={searchText}
//             onKeyDown={handleSearchInputKeys}
//           />
//           <div className={styles.suggestionsContainer}>
//             {suggestions.map((suggestion, indx) => (
//               <div className={styles.suggestion} key={indx}>
//                 <span onClick={suggestion.onClick}>{suggestion.text}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>    </div>
//   )
// }
//
// // const swiperProps: SwiperProps = {
// //   grabCursor: true,
// //   effect: "coverflow",
// //   centeredSlides: true,
// //   loop: true,
// //   slidesPerView: 3,
// //   coverflowEffect: {
// //     rotate: 0,
// //     stretch: 0,
// //     depth: 100,
// //     modifier: 2.5,
// //   },
// //   pagination: {
// //     el: ".swiper-pagination",
// //     clickable: true,
// //   },
// //   navigation: {
// //     nextEl: ".swiper-button-next",
// //     prevEl: ".swiper-button-prev",
// //   },
// //   modules: [EffectCoverflow, Pagination, Navigation],
// // }
//
// const SwiperResults = ({products}:{ products:Product[] }) => {
//   return <div>{products.map((x) => JSON.stringify(x))}</div>
// }
// //   const swiperElRef = useRef(null)
// //   return (<swiper-container ref={swiperElRef} class=""></swiper-container>
// //   //   <Swiper {...swiperProps} className="swiper_container">
// //   //     {products.map((p, indx) => (
// //   //       <SwiperSlide key={indx}>
// //   //         <ProductCard product={p} />
// //   //       </SwiperSlide>
// //   //     ))}
// //   //   </Swiper>
// //   // </div>
// // }
//
// const FramerResults = ({ products }: { products: Product[] }) => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexWrap: "wrap",
//         flexDirection: "row",
//       }}
//     >
//       <AnimatePresence>
//         {products.map((p) => (
//           <motion.div
//             layout
//             className={styles.productCardCell}
//             key={p.id}
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1, animation: "linear" }}
//             exit={{ opacity: 0, scale: 0 }}
//           >
//             <ProductCard product={p} />
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   )
// }
//
//
// export interface SearchProps { query: string; tags: string[], availableTags: string[] }
// const Search = ({ query, tags, availableTags }:  SearchProps) => {
// //const Search = () => {
//
// console.log("\n\n\n\nHEY MATT MATT search (just search) STARTING TO RENDER")
//
//   const [products, setProducts] = useState<Product[]>([])
//   const [resultsKind, setResultsKind] = useState<string>("animate")
//
//
//
//
//   return (
//     <>
//       <div className={styles.toastContainer}>
//         <p>
//           <strong>results style</strong>:
//           <select onChange={(e) => setResultsKind(e.target.value)} value={resultsKind}>
//             <option value="animate">animated results</option>
//             <option value="swiper">swiper results</option>
//           </select>
//         </p>
//       </div>
//
//       <div>
//         <Suspense>
//         <SearchBar setProducts={setProducts} availableTags={availableTags} /></Suspense>
//         {resultsKind === "animate" ? (
//           <FramerResults products={products} />
//         ) : (
//           <SwiperResults products={products} />
//         )}
//       </div>
//     </>
//   )
// }
//
// export default Search
