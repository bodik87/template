import React, { Suspense } from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { PageSearchParams } from '@/lib/schema';
import { CATEGORIES, PRODUCTS } from '@/data'
import CategoryBreadcrumbs from './_components/CategoryBreadcrumbs';
import Fallback from '@/components/ui/Fallback';
import ProductCard from '@/components/ui/ProductCard';

type Props = { searchParams: PageSearchParams }

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = searchParams.id

  return {
    title: CATEGORIES
      .filter(category =>
        category.id === Number(id))[0].title,
    description: "Generated by create next app",
    // openGraph: {
    //   images: '/products/1.png',
    // },
  }
}

export default function Category({ searchParams }: Props) {
  const id = searchParams.id

  const categoryHref = `${CATEGORIES
    .filter(category =>
      category.id === Number(id))[0].slug}/`

  return (
    <>
      <Suspense fallback={<Fallback />}>

        <div className="wrapper">
          <CategoryBreadcrumbs id={id} />

          <h2 className='mt-4'>
            {CATEGORIES.filter(category =>
              category.id === Number(id))[0].title}
          </h2>
        </div>

        <div className="wrapper productsGrid">
          {PRODUCTS
            .filter(product => product.categoryId === Number(id))
            .map(
              (el) =>
                <ProductCard
                  key={el.id}
                  categoryHref={categoryHref}
                  item={el}
                />
            )}
        </div>
      </Suspense>
    </ >
  )
}