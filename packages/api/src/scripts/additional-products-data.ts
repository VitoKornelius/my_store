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

type Item = [string, string, number, string]
type SellerItems = {
  email: string
  prefix: string
  category: string
  items: Item[]
}

const photo = (id: string) =>
  "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1200&q=85"

const sellerItems: SellerItems[] = [
  {
    email: "ceramics@local.com",
    prefix: "KCX",
    category: "Ceramic Collection",
    items: [
      ["Чайник Morning", "ceramic-morning-teapot", 58, photo("photo-1577937927133-66ef06acdf18")],
      ["Піала Matcha", "ceramic-matcha-bowl", 27, photo("photo-1514228742587-6b1558fcca3d")],
      ["Глечик White Clay", "ceramic-white-clay-jug", 44, photo("photo-1610701596007-11502861dcfa")],
      ["Набір Espresso Duo", "ceramic-espresso-duo", 36, photo("photo-1495474472287-4d71bcdd2085")],
    ],
  },
  {
    email: "linen@local.com",
    prefix: "LLX",
    category: "Linen Collection",
    items: [
      ["Лляні штани Breeze", "linen-breeze-pants", 72, photo("photo-1594633312681-425c7b97ccd1")],
      ["Сукня Summer", "linen-summer-dress", 94, photo("photo-1595777457583-95e059d581b8")],
      ["Фартух Kitchen", "linen-kitchen-apron", 41, photo("photo-1556911220-bff31c812dba")],
      ["Наволочка Soft", "linen-soft-pillowcase", 24, photo("photo-1584100936595-c0654b55a2e2")],
    ],
  },
  {
    email: "wood@local.com",
    prefix: "CWX",
    category: "Wood Collection",
    items: [
      ["Полиця Horizon", "wood-horizon-shelf", 65, photo("photo-1532372320572-cda25653a694")],
      ["Таця Breakfast", "wood-breakfast-tray", 43, photo("photo-1556911220-bff31c812dba")],
      ["Підставка для телефону Dock", "wood-phone-dock", 25, photo("photo-1516321318423-f06f85e504b3")],
      ["Годинник Oak Time", "wood-oak-clock", 57, photo("photo-1563861826100-9cb868fdbe1c")],
    ],
  },
  {
    email: "studio@local.com",
    prefix: "DSX",
    category: "Urban Collection",
    items: [
      ["Гаманець Fold", "urban-fold-wallet", 49, photo("photo-1627123424574-724758594e93")],
      ["Чохол для ноутбука Sleeve", "urban-laptop-sleeve", 55, photo("photo-1496181133206-80ce9b88a853")],
      ["Поясна сумка Metro", "urban-metro-bag", 46, photo("photo-1553062407-98eeb64c6a62")],
      ["Блокнот Grid", "urban-grid-notebook", 19, photo("photo-1517842645767-c639042777db")],
    ],
  },
  {
    email: "coffee@local.com",
    prefix: "BSX",
    category: "Coffee Selection",
    items: [
      ["Кава Kenya Citrus", "coffee-kenya-citrus", 19, photo("photo-1447933601403-0c6688de566e")],
      ["Кава Guatemala Caramel", "coffee-guatemala-caramel", 18, photo("photo-1442512595331-e89e73853f31")],
      ["Френч-прес Clear", "coffee-clear-french-press", 39, photo("photo-1495474472287-4d71bcdd2085")],
      ["Ваги Barista", "coffee-barista-scale", 47, photo("photo-1501339847302-ac426a4a7cbb")],
    ],
  },
  {
    email: "honey@local.com",
    prefix: "PHX",
    category: "Honey Selection",
    items: [
      ["Мед липовий", "linden-honey", 15, photo("photo-1587049352846-4a222e784d38")],
      ["Мед з горіхами", "honey-with-nuts", 19, photo("photo-1558642452-9d2a7deb7f62")],
      ["Прополіс натуральний", "natural-propolis", 13, photo("photo-1471943311424-646960669fbc")],
      ["Свічка Honeycomb", "honeycomb-candle", 16, photo("photo-1602874801006-e26b9d3a8e8f")],
    ],
  },
  {
    email: "tech@local.com",
    prefix: "KTX",
    category: "Tech Selection",
    items: [
      ["Портативна батарея Power", "tech-power-bank", 52, photo("photo-1609091839311-d5365f9ff1c5")],
      ["Bluetooth колонка Sound", "tech-sound-speaker", 69, photo("photo-1608043152269-423dbba4e7e1")],
      ["Бездротова миша Arc", "tech-arc-mouse", 38, photo("photo-1527814050087-3793815479db")],
      ["Навушники Quiet", "tech-quiet-headphones", 84, photo("photo-1505740420928-5e560c06d30e")],
    ],
  },
  {
    email: "green@local.com",
    prefix: "GHX",
    category: "Plant Selection",
    items: [
      ["Калатея Pattern", "plant-calathea-pattern", 31, photo("photo-1501004318641-b39e6451bec6")],
      ["Пальма Areca", "plant-areca-palm", 43, photo("photo-1485955900006-10f4d324d411")],
      ["Набір кактусів Mini", "plant-mini-cactus-set", 23, photo("photo-1459411621453-7b03977f4bfc")],
      ["Підставка для рослин Stand", "plant-wood-stand", 37, photo("photo-1484154218962-a197022b5858")],
    ],
  },
  {
    email: "craft@local.com",
    prefix: "ZCX",
    category: "Craft Selection",
    items: [
      ["Ліжник Carpathian", "craft-carpathian-lizhnyk", 112, photo("photo-1583845112203-29329902332e")],
      ["Ткана сумка Vereta", "craft-vereta-bag", 51, photo("photo-1529139574466-a303027c1d8b")],
      ["Дерев'яна таріль Sun", "craft-sun-plate", 38, photo("photo-1544816155-12df9643f363")],
      ["Набір писанок Tradition", "craft-pysanka-set", 34, photo("photo-1549465220-1a8b9238cd48")],
    ],
  },
  {
    email: "kids@local.com",
    prefix: "CKX",
    category: "Kids Selection",
    items: [
      ["Магнітний конструктор Space", "kids-space-magnets", 45, photo("photo-1596461404969-9ae70f2830c1")],
      ["Книга казок Dream", "kids-dream-book", 21, photo("photo-1481627834876-b7833e8f5570")],
      ["Набір пластиліну Color", "kids-color-clay", 18, photo("photo-1513364776144-60967b0f800f")],
      ["Нічник Moon", "kids-moon-light", 32, photo("photo-1507473885765-e6ed057f782c")],
    ],
  },
  {
    email: "sport@local.com",
    prefix: "USX",
    category: "Sport Selection",
    items: [
      ["Скакалка Speed", "sport-speed-rope", 17, photo("photo-1517836357463-d25dfeac3438")],
      ["Сумка Gym", "sport-gym-bag", 49, photo("photo-1553062407-98eeb64c6a62")],
      ["Рушник Quick Dry", "sport-quick-dry-towel", 22, photo("photo-1592432678016-e910b452f9a2")],
      ["Баланс-борд Balance", "sport-balance-board", 67, photo("photo-1571019613454-1cb2f99b2d8b")],
    ],
  },
  {
    email: "beauty@local.com",
    prefix: "BBX",
    category: "Beauty Selection",
    items: [
      ["Маска для обличчя Clay", "beauty-clay-mask", 26, photo("photo-1556228720-195a672e8a03")],
      ["Бальзам для губ Berry", "beauty-berry-balm", 12, photo("photo-1608248543803-ba4f8c70ae0b")],
      ["Скраб для тіла Sugar", "beauty-sugar-scrub", 24, photo("photo-1571781926291-c477ebfd024b")],
      ["Аромасвічка Evening", "beauty-evening-candle", 29, photo("photo-1602874801006-e26b9d3a8e8f")],
    ],
  },
]

export default async function seedMoreProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productService = container.resolve(Modules.PRODUCT)
  const inventoryService = container.resolve(Modules.INVENTORY)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const emails = sellerItems.map((seller) => seller.email)

  const { data: sellers } = await query.graph({
    entity: "seller",
    fields: ["id", "email"],
    filters: { email: emails },
  })
  if (sellers.length !== emails.length) {
    throw new Error("This seed only works with the existing 12 demo sellers.")
  }

  const allItems = sellerItems.flatMap((seller) =>
    seller.items.map((item, index) => ({
      sellerEmail: seller.email,
      prefix: seller.prefix,
      category: seller.category,
      index,
      title: item[0],
      handle: item[1],
      price: item[2],
      image: item[3],
    }))
  )
  const existingProducts = await productService.listProducts({
    handle: allItems.map((item) => item.handle),
  })
  const existingHandles = new Set(existingProducts.map((product) => product.handle))
  const itemsToCreate = allItems.filter((item) => !existingHandles.has(item.handle))

  const existingCategories = await productService.listProductCategories({}, { take: 500 })
  const categoryNames = [...new Set(itemsToCreate.map((item) => item.category))]
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

  for (const item of itemsToCreate) {
    const seller = sellers.find((record) => record.email === item.sellerEmail)!
    const category = categories.find((record) => record.name === item.category)!
    const sku = item.prefix + "-" + String(item.index + 1).padStart(2, "0")
    await createProductsWorkflow(container).run({
      input: {
        products: [{
          title: item.title,
          handle: item.handle,
          description: item.title + ". Додатковий демонстраційний товар магазину.",
          category_ids: [category.id],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          weight: 400,
          images: [{ url: item.image }],
          options: [{ title: "Комплектація", values: ["Базова", "Розширена"] }],
          variants: [
            {
              title: "Базова",
              sku: sku + "-BASE",
              options: { "Комплектація": "Базова" },
              prices: [
                { amount: item.price, currency_code: "eur" },
                { amount: Math.round(item.price * 1.1), currency_code: "usd" },
              ],
            },
            {
              title: "Розширена",
              sku: sku + "-PLUS",
              options: { "Комплектація": "Розширена" },
              prices: [
                { amount: Math.round(item.price * 1.2), currency_code: "eur" },
                { amount: Math.round(item.price * 1.32), currency_code: "usd" },
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
      stocked_quantity: 60,
    }))
  if (levels.length) {
    await createInventoryLevelsWorkflow(container).run({ input: { inventory_levels: levels } })
  }

  logger.info("Added " + allItems.length + " products to the existing sellers.")
}
