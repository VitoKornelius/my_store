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

type ProductSeed = [
  title: string,
  handle: string,
  category: string,
  price: number,
  image: string,
]

type SellerCatalog = {
  email: string
  prefix: string
  products: ProductSeed[]
}

const image = (id: string) =>
  "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1200&q=85"

const catalogs: SellerCatalog[] = [
  {
    email: "coffee@local.com",
    prefix: "BSC",
    products: [
      ["Кава Ethiopia Bloom", "coffee-ethiopia-bloom", "Кава та чай", 18, image("photo-1447933601403-0c6688de566e")],
      ["Кава Colombia Cocoa", "coffee-colombia-cocoa", "Кава та чай", 17, image("photo-1495474472287-4d71bcdd2085")],
      ["Кава Brazil Nut", "coffee-brazil-nut", "Кава та чай", 16, image("photo-1442512595331-e89e73853f31")],
      ["Керамічний дріпер Wave", "coffee-wave-dripper", "Кавове приладдя", 29, image("photo-1511081692775-05d0f180a065")],
      ["Ручна кавомолка Steel", "coffee-steel-grinder", "Кавове приладдя", 54, image("photo-1501339847302-ac426a4a7cbb")],
      ["Термочашка Coast", "coffee-coast-tumbler", "Термопосуд", 32, image("photo-1544787219-7f47ccb76574")],
    ],
  },
  {
    email: "honey@local.com",
    prefix: "PH",
    products: [
      ["Мед акацієвий", "acacia-honey", "Їжа", 14, image("photo-1587049352846-4a222e784d38")],
      ["Мед гречаний", "buckwheat-honey", "Їжа", 13, image("photo-1471943311424-646960669fbc")],
      ["Крем-мед з малиною", "raspberry-cream-honey", "Їжа", 16, image("photo-1558642452-9d2a7deb7f62")],
      ["Свічка з вощини", "beeswax-candle", "Свічки", 12, image("photo-1602874801006-e26b9d3a8e8f")],
      ["Набір медових свічок", "honey-candle-set", "Свічки", 25, image("photo-1603006905003-be475563bc59")],
      ["Подарунковий набір Пасіка", "apiary-gift-box", "Подарунки", 38, image("photo-1549465220-1a8b9238cd48")],
    ],
  },
  {
    email: "tech@local.com",
    prefix: "KT",
    products: [
      ["Бездротова зарядка Orbit", "orbit-wireless-charger", "Електроніка", 42, image("photo-1586953208448-b95a79798f07")],
      ["Підставка для ноутбука Air", "air-laptop-stand", "Електроніка", 49, image("photo-1496181133206-80ce9b88a853")],
      ["Механічна клавіатура Mono", "mono-keyboard", "Електроніка", 89, image("photo-1587829741301-dc798b83add3")],
      ["Настільний хаб Connect", "connect-usb-hub", "Електроніка", 36, image("photo-1550745165-9bc0b252726f")],
      ["Органайзер кабелів Loop", "loop-cable-organizer", "Організація простору", 14, image("photo-1516321318423-f06f85e504b3")],
      ["LED лампа Pixel", "pixel-led-lamp", "Smart освітлення", 47, image("photo-1507473885765-e6ed057f782c")],
    ],
  },
  {
    email: "green@local.com",
    prefix: "GH",
    products: [
      ["Монстера Mini", "mini-monstera", "Рослини", 28, image("photo-1501004318641-b39e6451bec6")],
      ["Фікус Green", "green-ficus", "Рослини", 34, image("photo-1485955900006-10f4d324d411")],
      ["Сукуленти Trio", "succulent-trio", "Рослини", 22, image("photo-1459411621453-7b03977f4bfc")],
      ["Кашпо Stone", "stone-planter", "Кашпо", 19, image("photo-1484154218962-a197022b5858")],
      ["Лійка Nordic", "nordic-watering-can", "Для саду", 31, image("photo-1416879595882-3373a0480b5b")],
      ["Набір для вирощування трав", "herb-growing-kit", "Для саду", 24, image("photo-1585320806297-9794b3e4eeae")],
    ],
  },
  {
    email: "craft@local.com",
    prefix: "ZC",
    products: [
      ["Вовняний плед Mountain", "mountain-wool-blanket", "Ткані вироби", 76, image("photo-1583845112203-29329902332e")],
      ["Ткана доріжка Vereta", "vereta-table-runner", "Ткані вироби", 39, image("photo-1604014237800-1c9102c219da")],
      ["Кошик з лози", "willow-basket", "Народний декор", 44, image("photo-1529139574466-a303027c1d8b")],
      ["Різьблена шкатулка", "carved-wood-box", "Подарунки", 36, image("photo-1544816155-12df9643f363")],
      ["Вишита подушка", "embroidered-pillow", "Ткані вироби", 42, image("photo-1584100936595-c0654b55a2e2")],
      ["Підсвічник Carpathian", "carpathian-candle-holder", "Народний декор", 27, image("photo-1602874801006-e26b9d3a8e8f")],
    ],
  },
  {
    email: "kids@local.com",
    prefix: "CK",
    products: [
      ["Дерев'яний конструктор City", "kids-city-blocks", "Дитячі товари", 38, image("photo-1596461404969-9ae70f2830c1")],
      ["Пазл Animals", "kids-animals-puzzle", "Дитячі товари", 21, image("photo-1598880940080-ff9a29891b85")],
      ["Набір для малювання Art Box", "kids-art-box", "Творчість", 29, image("photo-1513364776144-60967b0f800f")],
      ["М'яка іграшка Bear", "kids-soft-bear", "Дитячі товари", 26, image("photo-1559454403-b8fb88521f11")],
      ["Дитячий рюкзак Mini", "kids-mini-backpack", "Дитячі аксесуари", 34, image("photo-1553062407-98eeb64c6a62")],
      ["Картки First Words", "kids-first-words", "Книги", 15, image("photo-1481627834876-b7833e8f5570")],
    ],
  },
  {
    email: "sport@local.com",
    prefix: "US",
    products: [
      ["Килимок для йоги Flow", "sport-yoga-flow", "Спорт", 41, image("photo-1592432678016-e910b452f9a2")],
      ["Гантелі Core", "sport-core-dumbbells", "Спорт", 52, image("photo-1583454110551-21f2fa2afe61")],
      ["Пляшка Active", "sport-active-bottle", "Спорт", 19, image("photo-1602143407151-7111542de6e8")],
      ["Еспандери Set", "sport-resistance-set", "Спорт", 27, image("photo-1517836357463-d25dfeac3438")],
      ["Ролер Recovery", "sport-recovery-roller", "Спорт", 32, image("photo-1571019613454-1cb2f99b2d8b")],
      ["Міський рюкзак Move", "sport-move-backpack", "Спортивні аксесуари", 58, image("photo-1553062407-98eeb64c6a62")],
    ],
  },
  {
    email: "beauty@local.com",
    prefix: "BB",
    products: [
      ["Крем для обличчя Dew", "beauty-dew-cream", "Краса", 31, image("photo-1556228720-195a672e8a03")],
      ["Сироватка Vitamin C", "beauty-vitamin-serum", "Краса", 37, image("photo-1608248543803-ba4f8c70ae0b")],
      ["Олія для тіла Bloom", "beauty-bloom-oil", "Краса", 28, image("photo-1571781926291-c477ebfd024b")],
      ["Сіль для ванни Calm", "beauty-calm-salt", "Краса", 17, image("photo-1598440947619-2c35fc9aa908")],
      ["Натуральне мило Trio", "beauty-soap-trio", "Краса", 22, image("photo-1600857544200-b2f666a9a2ec")],
      ["Подарунковий набір Ritual", "beauty-ritual-box", "Подарунки", 62, image("photo-1549465220-1a8b9238cd48")],
    ],
  },
]

export default async function seedLargeCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productService = container.resolve(Modules.PRODUCT)
  const inventoryService = container.resolve(Modules.INVENTORY)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const sellerEmails = catalogs.map((catalog) => catalog.email)
  const products = catalogs.flatMap((catalog) =>
    catalog.products.map((product, index) => ({
      sellerEmail: catalog.email,
      prefix: catalog.prefix,
      index,
      title: product[0],
      handle: product[1],
      category: product[2],
      price: product[3],
      image: product[4],
    }))
  )

  const { data: sellers } = await query.graph({
    entity: "seller",
    fields: ["id", "email", "status"],
    filters: { email: sellerEmails },
  })
  if (sellers.length !== sellerEmails.length) {
    throw new Error("Expected " + sellerEmails.length + " sellers, found " + sellers.length)
  }
  for (const seller of sellers) {
    if (seller.status === "pending_approval") {
      await approveSellerWorkflow(container).run({ input: { seller_id: seller.id } })
    }
  }

  const categoryNames = [...new Set(products.map((product) => product.category))]
  const allCategories = await productService.listProductCategories({}, { take: 500 })
  const existingCategories = allCategories.filter((category) =>
    categoryNames.includes(category.name)
  )
  const missingNames = categoryNames.filter(
    (name) => !existingCategories.some((category) => category.name === name)
  )
  let categories = existingCategories
  if (missingNames.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingNames.map((name) => ({ name, is_active: true })),
      },
    })
    categories = [...categories, ...result]
  }

  const [shippingProfile] = await fulfillmentService.listShippingProfiles({ type: "default" })
  const [salesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  })
  const [stockLocation] = await stockLocationService.listStockLocations({})
  if (!shippingProfile || !salesChannel || !stockLocation) {
    throw new Error("Base marketplace data is missing.")
  }

  const existingProducts = await productService.listProducts({
    handle: products.map((product) => product.handle),
  })
  const existingHandles = new Set(existingProducts.map((product) => product.handle))

  for (const product of products) {
    if (existingHandles.has(product.handle)) {
      continue
    }
    const seller = sellers.find((item) => item.email === product.sellerEmail)!
    const category = categories.find((item) => item.name === product.category)!
    const skuBase = product.prefix + "-" + String(product.index + 1).padStart(2, "0")
    await createProductsWorkflow(container).run({
      input: {
        products: [{
          title: product.title,
          handle: product.handle,
          description: product.title + " від магазину " +
            catalogs.find((catalog) => catalog.email === product.sellerEmail)!.email.split("@")[0] +
            ". Демонстраційний товар маркетплейсу Mercur.",
          category_ids: [category.id],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          weight: 400,
          images: [{ url: product.image }],
          options: [{ title: "Варіант", values: ["Стандарт", "Преміум"] }],
          variants: [
            {
              title: "Стандарт",
              sku: skuBase + "-STD",
              options: { "Варіант": "Стандарт" },
              prices: [
                { amount: product.price, currency_code: "eur" },
                { amount: Math.round(product.price * 1.1), currency_code: "usd" },
              ],
            },
            {
              title: "Преміум",
              sku: skuBase + "-PRM",
              options: { "Варіант": "Преміум" },
              prices: [
                { amount: Math.round(product.price * 1.25), currency_code: "eur" },
                { amount: Math.round(product.price * 1.38), currency_code: "usd" },
              ],
            },
          ],
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
  const stockedIds = new Set(existingLevels.map((level) => level.inventory_item_id))
  const levels: CreateInventoryLevelInput[] = inventoryItems
    .filter((item) => !stockedIds.has(item.id))
    .map((item) => ({
      inventory_item_id: item.id,
      location_id: stockLocation.id,
      stocked_quantity: 75,
    }))
  if (levels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: levels },
    })
  }

  logger.info(
    "Large catalog ready: " + sellers.length + " sellers and " + products.length + " products."
  )
}
