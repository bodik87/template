import React, { Suspense } from 'react'
import { CATEGORIES, PRODUCTS } from '@/data'
import Link from 'next/link'
import { Home, ChevronRight, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Counter from './_components/Counter'
import Description from './_components/Description'
import ProductBreadcrumbs from './_components/ProductBreadcrumbs'

type PageSearchParams = {
  id: string
}

type Props = {
  searchParams: PageSearchParams
}

function SearchBarFallback() {
  return <div className='wrapper py-5'>Loading...</div>
}

export default function Product({ searchParams }: Props) {
  const id = searchParams.id

  const product = PRODUCTS
    .filter(product =>
      product.id === Number(id))[0]

  const categoryHref = `${CATEGORIES
    .filter(category =>
      category.id === Number(product.categoryId))[0].slug}/`

  const currentProduct = (parametr: any) => {
    return PRODUCTS
      .filter(product =>
        product.id === Number(parametr.productId))[0]
  }

  return (
    <section className=''>
      <Suspense fallback={<SearchBarFallback />}>
        <div className="wrapper py-5">

          <ProductBreadcrumbs
            categoryHref={categoryHref}
            categoryId={product.categoryId}
            title={product.title}
          />

          <section className='mt-4 flex flex-col lg:flex-row gap-4'>
            <div className='p-4 w-full lg:w-3/4 bg-white rounded-xl flex flex-col md:flex-row gap-8'>
              <div className=' flex flex-col md:flex-row gap-4'>
                <Image
                  src={product.images[0]}
                  alt={"Img"}
                  width={408}
                  height={100}
                  className="w-full object-contain rounded-lg"
                  priority
                  quality={100}
                />
              </div>

              <div className='md:min-w-[300px]'>
                <h2 className='font-bold text-3xl'>{product.title}</h2>
                <small>EAN: {product.code}</small>

                {product.sizeOptions.length > 0 &&
                  <>
                    <b className='block mt-5'>Sizes</b>
                    <div className='mt-2 mb-4 flex gap-3'>{product.sizeOptions.map(size => (
                      <Link
                        key={size.id}
                        href={{
                          pathname: categoryHref + currentProduct(size).slug + currentProduct(size).code, query: {
                            id: currentProduct(size).id
                          }
                        }}
                        className={cn("w-full flex items-center justify-center p-2 rounded-md",
                          product.id === size.productId ? "bg-green-600 text-white font-bold" : "bg-gray-200"
                        )}>
                        {size.size}
                      </Link>
                    ))}
                    </div>
                  </>
                }

                <Description description={product.description} />
              </div>
            </div>

            <div className='w-full md:w-1/4 min-w-[300px] bg-white h-fit p-4 rounded-xl '>
              {product.isAvailable && <Counter price={product.price} />}

              <button
                disabled={!product.isAvailable}
                className={cn("w-full bg-green-600 disabled:bg-gray-400 text-white font-bold text-lg flex items-center justify-center px-2 py-4 rounded-lg",
                  product.isAvailable && "mt-4")}
              >
                {product.isAvailable ? "Add to cart" : "No product"}
              </button>

              <a
                className='mt-4 flex gap-4 justify-center items-center bg-gray-100 w-full p-3 rounded-lg'
                href="tel:+380672785349">
                <Phone
                  size={18}
                  className='fill-green-600 stroke-green-600' />
                <span>+38-067-278-53-49</span>
              </a>

            </div>
          </section>


          {product.analogues.length > 0 &&
            <>
              <b className='block mt-5'>Analogues</b>
              <div className='mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                {product.analogues.map(analogue => (
                  <div key={analogue.id} className='w-full'>
                    <Link
                      href={{
                        pathname: categoryHref + currentProduct(analogue).slug + currentProduct(analogue).code, query: {
                          id: currentProduct(analogue).id
                        }
                      }}
                      className="flex flex-col h-full bg-white p-2 md:p-4 rounded-xl w-full shadow">
                      <Image
                        src={currentProduct(analogue).images[0]}
                        alt={"Img"}
                        width={408}
                        height={100}
                        className="w-full object-contain rounded-lg"
                        priority
                        quality={100}
                      />

                      <h3 className='mt-3 font-bold'>{currentProduct(analogue).title}</h3>
                      <p className='font-bold'>{currentProduct(analogue).price} zl</p>
                    </Link>

                  </div>
                ))}
              </div>
            </>
          }
        </div>
      </Suspense>
    </section>
  )
}