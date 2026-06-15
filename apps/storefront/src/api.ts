export type Category = {
  id: string
  name: string
}

export type ProductOptionValue = {
  value: string
  option?: { title?: string }
}

export type ProductVariant = {
  id: string
  title: string
  inventory_quantity?: number
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  }
  options?: ProductOptionValue[]
}

export type Product = {
  id: string
  title: string
  handle: string
  description?: string | null
  thumbnail?: string | null
  images?: Array<{ url: string }>
  categories?: Category[]
  seller?: {
    id: string
    name: string
  } | null
  variants?: ProductVariant[]
}

const backendUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'
const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY

async function storeRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    headers: {
      'x-publishable-api-key': publishableKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Store API повернув помилку ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getProducts(): Promise<Product[]> {
  const regionResponse = await storeRequest<{ regions: Array<{ id: string }> }>('/store/regions')
  const regionId = regionResponse.regions[0]?.id

  if (!regionId) {
    throw new Error('Не знайдено активного регіону магазину')
  }

  const params = new URLSearchParams({
    limit: '100',
    region_id: regionId,
    fields: '*variants.calculated_price,+variants.inventory_quantity,+categories,+seller.*',
  })
  const response = await storeRequest<{ products: Product[] }>(`/store/products?${params}`)
  return response.products
}
