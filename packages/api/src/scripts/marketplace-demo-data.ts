import type { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import { approveSellerWorkflow } from "@mercurjs/core-plugin/workflows"

type DemoProduct = {
  sellerEmail: string
  title: string
  handle: string
  category: string
  description: string
  image: string
  variants: Array<{ title: string; sku: string; price: number }>
}

const sellerEmails = [
  "ceramics@local.com",
  "linen@local.com",
  "wood@local.com",
  "studio@local.com",
]

const demoProducts: DemoProduct[] = [
  {
    sellerEmail: "ceramics@local.com",
    title: "Чашка Dnipro Blue",
    handle: "dnipro-blue-cup",
    category: "Кераміка",
    description: "Керамічна чашка ручної роботи з глибокою синьою глазур'ю.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "250 мл", sku: "KC-CUP-250", price: 24 },
      { title: "350 мл", sku: "KC-CUP-350", price: 29 },
    ],
  },
  {
    sellerEmail: "ceramics@local.com",
    title: "Тарілка Sand",
    handle: "sand-ceramic-plate",
    category: "Кераміка",
    description: "Матова столова тарілка природного пісочного відтінку.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "Мала", sku: "KC-PLATE-S", price: 21 },
      { title: "Велика", sku: "KC-PLATE-L", price: 31 },
    ],
  },
  {
    sellerEmail: "ceramics@local.com",
    title: "Ваза Terra",
    handle: "terra-vase",
    category: "Декор",
    description: "Фактурна ваза з червоної глини для сухоцвітів та живих квітів.",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "Низька", sku: "KC-VASE-S", price: 39 },
      { title: "Висока", sku: "KC-VASE-L", price: 52 },
    ],
  },
  {
    sellerEmail: "linen@local.com",
    title: "Лляна сорочка Misto",
    handle: "misto-linen-shirt",
    category: "Одяг",
    description: "Вільна лляна сорочка для теплого сезону, пошита у Львові.",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "S / M", sku: "LL-SHIRT-SM", price: 68 },
      { title: "L / XL", sku: "LL-SHIRT-LXL", price: 68 },
    ],
  },
  {
    sellerEmail: "linen@local.com",
    title: "Скатертина Natural",
    handle: "natural-linen-tablecloth",
    category: "Текстиль",
    description: "Щільна лляна скатертина з м'яким фабричним пранням.",
    image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "140 x 180 см", sku: "LL-TABLE-140", price: 59 },
      { title: "140 x 240 см", sku: "LL-TABLE-240", price: 74 },
    ],
  },
  {
    sellerEmail: "linen@local.com",
    title: "Набір серветок Linen",
    handle: "linen-napkin-set",
    category: "Текстиль",
    description: "Комплект багаторазових лляних серветок для сервірування.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "2 штуки", sku: "LL-NAPKIN-2", price: 18 },
      { title: "4 штуки", sku: "LL-NAPKIN-4", price: 32 },
    ],
  },
  {
    sellerEmail: "wood@local.com",
    title: "Дошка Hutsul",
    handle: "hutsul-serving-board",
    category: "Для кухні",
    description: "Сервірувальна дошка з масиву ясена, оброблена натуральною олією.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "35 см", sku: "CW-BOARD-35", price: 34 },
      { title: "50 см", sku: "CW-BOARD-50", price: 46 },
    ],
  },
  {
    sellerEmail: "wood@local.com",
    title: "Настільна лампа Runa",
    handle: "runa-wood-lamp",
    category: "Освітлення",
    description: "Мінімалістична лампа з дуба з теплим розсіяним світлом.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "Світлий дуб", sku: "CW-LAMP-OAK", price: 89 },
      { title: "Темний дуб", sku: "CW-LAMP-DARK", price: 94 },
    ],
  },
  {
    sellerEmail: "wood@local.com",
    title: "Органайзер Desk",
    handle: "wood-desk-organizer",
    category: "Аксесуари",
    description: "Компактний дерев'яний органайзер для робочого столу.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "Бук", sku: "CW-DESK-BEECH", price: 27 },
      { title: "Горіх", sku: "CW-DESK-WALNUT", price: 32 },
    ],
  },
  {
    sellerEmail: "studio@local.com",
    title: "Шкіряний кардхолдер Line",
    handle: "line-cardholder",
    category: "Аксесуари",
    description: "Тонкий кардхолдер з натуральної шкіри на шість карток.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "Чорний", sku: "DS-CARD-BLACK", price: 35 },
      { title: "Коньячний", sku: "DS-CARD-TAN", price: 35 },
    ],
  },
  {
    sellerEmail: "studio@local.com",
    title: "Сумка City Tote",
    handle: "city-tote-bag",
    category: "Сумки",
    description: "Містка міська сумка з міцного канвасу з внутрішньою кишенею.",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "Графіт", sku: "DS-TOTE-GRAPHITE", price: 48 },
      { title: "Молочний", sku: "DS-TOTE-CREAM", price: 48 },
    ],
  },
  {
    sellerEmail: "studio@local.com",
    title: "Планер Focus",
    handle: "focus-weekly-planner",
    category: "Канцелярія",
    description: "Недатований тижневий планер для задач, нотаток і звичок.",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=85",
    variants: [
      { title: "Soft cover", sku: "DS-PLAN-SOFT", price: 16 },
      { title: "Hard cover", sku: "DS-PLAN-HARD", price: 22 },
    ],
  },
]

export default async function seedMarketplaceDemo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productService = container.resolve(Modules.PRODUCT)
  const inventoryService = container.resolve(Modules.INVENTORY)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)

  const { data: sellers } = await query.graph({
    entity: "seller",
    fields: ["id", "email", "status"],
    filters: { email: sellerEmails },
  })

  if (sellers.length !== sellerEmails.length) {
    throw new Error("Expected " + sellerEmails.length + " demo sellers, found " + sellers.length + ".")
  }

  for (const seller of sellers) {
    if (seller.status === "pending_approval") {
      await approveSellerWorkflow(container).run({
        input: { seller_id: seller.id },
      })
    }
  }

  const existingProducts = await productService.listProducts({
    handle: demoProducts.map((product) => product.handle),
  })
  const existingHandles = new Set(existingProducts.map((product) => product.handle))
  const productsToCreate = demoProducts.filter((product) => !existingHandles.has(product.handle))

  const categoryNames = [...new Set(productsToCreate.map((product) => product.category))]
  const allCategories = await productService.listProductCategories({}, { take: 500 })
  const existingCategories = allCategories.filter((category) =>
    categoryNames.includes(category.name)
  )
  const missingCategoryNames = categoryNames.filter(
    (name) => !existingCategories.some((category) => category.name === name)
  )
  let categories = existingCategories
  if (missingCategoryNames.length) {
    const { result: createdCategories } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategoryNames.map((name) => ({
          name,
          is_active: true,
        })),
      },
    })
    categories = [...categories, ...createdCategories]
  }

  const [shippingProfile] = await fulfillmentService.listShippingProfiles({
    type: "default",
  })
  const [salesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  })
  const [stockLocation] = await stockLocationService.listStockLocations({})

  if (!shippingProfile || !salesChannel || !stockLocation) {
    throw new Error("Run the base seed before the marketplace demo seed.")
  }

  for (const product of productsToCreate) {
    const seller = sellers.find((item) => item.email === product.sellerEmail)!
    const category = categories.find((item) => item.name === product.category)!
    await createProductsWorkflow(container).run({
      input: {
        products: [{
          title: product.title,
          handle: product.handle,
          description: product.description,
          category_ids: [category.id],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          weight: 500,
          images: [{ url: product.image }],
          options: [{
            title: "Варіант",
            values: product.variants.map((variant) => variant.title),
          }],
          variants: product.variants.map((variant) => ({
            title: variant.title,
            sku: variant.sku,
            options: { "Варіант": variant.title },
            prices: [
              { amount: variant.price, currency_code: "eur" },
              { amount: Math.round(variant.price * 1.1), currency_code: "usd" },
            ],
          })),
          sales_channels: [{ id: salesChannel.id }],
        }],
        additional_data: { seller_id: seller.id },
      },
    })
  }

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })
  const existingLevels = await inventoryService.listInventoryLevels({
    location_id: stockLocation.id,
  })
  const stockedItemIds = new Set(existingLevels.map((level) => level.inventory_item_id))
  const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems
    .filter((item) => !stockedItemIds.has(item.id))
    .map((item) => ({
      location_id: stockLocation.id,
      inventory_item_id: item.id,
      stocked_quantity: 50,
    }))

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    })
  }

  logger.info(
    "Marketplace demo ready: " + sellers.length + " sellers and " +
      demoProducts.length + " additional products."
  )
}
