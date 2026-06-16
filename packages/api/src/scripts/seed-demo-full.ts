import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  approveSellerWorkflow,
  createSellerAccountWorkflow,
} from "@mercurjs/core-plugin/workflows"

import seedBaseData from "./seed"
import seedMarketplaceProducts from "./seed-marketplace-demo"
import seedLargeCatalog from "./seed-large-catalog"
import seedMoreProducts from "./seed-more-products"

const ADMIN_PASSWORD = "admin123"
const SELLER_PASSWORD = "seller123"

const adminEmails = [
  "admin@local.com",
  "admin2@local.com",
  "admin3@local.com",
]

const sellers = [
  {
    name: "Kyiv Ceramics",
    email: "ceramics@local.com",
    description: "Handmade ceramic goods from Kyiv.",
    city: "Kyiv",
    first_name: "Olena",
    last_name: "Koval",
  },
  {
    name: "Lviv Linen",
    email: "linen@local.com",
    description: "Linen clothes and home textile from Lviv.",
    city: "Lviv",
    first_name: "Maria",
    last_name: "Boiko",
  },
  {
    name: "Carpathian Wood",
    email: "wood@local.com",
    description: "Wooden home goods from the Carpathians.",
    city: "Ivano-Frankivsk",
    first_name: "Andrii",
    last_name: "Melnyk",
  },
  {
    name: "Dnipro Studio",
    email: "studio@local.com",
    description: "Modern everyday accessories and design objects.",
    city: "Dnipro",
    first_name: "Iryna",
    last_name: "Shevchenko",
  },
  {
    name: "Black Sea Coffee",
    email: "coffee@local.com",
    description: "Specialty coffee and brewing accessories.",
    city: "Odesa",
    first_name: "Maksym",
    last_name: "Bondar",
  },
  {
    name: "Poltava Honey",
    email: "honey@local.com",
    description: "Honey, candles and natural gifts.",
    city: "Poltava",
    first_name: "Sofiia",
    last_name: "Tkachenko",
  },
  {
    name: "Kharkiv Tech",
    email: "tech@local.com",
    description: "Useful modern technology accessories.",
    city: "Kharkiv",
    first_name: "Dmytro",
    last_name: "Kravets",
  },
  {
    name: "Green Home",
    email: "green@local.com",
    description: "Plants and sustainable home products.",
    city: "Vinnytsia",
    first_name: "Anna",
    last_name: "Moroz",
  },
  {
    name: "Zakarpattya Craft",
    email: "craft@local.com",
    description: "Traditional handmade craft products.",
    city: "Uzhhorod",
    first_name: "Petro",
    last_name: "Koval",
  },
  {
    name: "Cherkasy Kids",
    email: "kids@local.com",
    description: "Creative and educational goods for children.",
    city: "Cherkasy",
    first_name: "Olha",
    last_name: "Savchuk",
  },
  {
    name: "Urban Sport",
    email: "sport@local.com",
    description: "Fitness and outdoor equipment.",
    city: "Kyiv",
    first_name: "Roman",
    last_name: "Lysenko",
  },
  {
    name: "Bloom Beauty",
    email: "beauty@local.com",
    description: "Natural skincare and self care products.",
    city: "Lutsk",
    first_name: "Viktoriia",
    last_name: "Danylchuk",
  },
]

async function createDemoAdmins(container: ExecArgs["container"]) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authService = container.resolve(Modules.AUTH) as any
  const userService = container.resolve(Modules.USER) as any
  const workflowService = container.resolve(Modules.WORKFLOW_ENGINE) as any
  const rbacService = container.resolve(Modules.RBAC) as any

  const existingUsers = await userService.listUsers({
    email: adminEmails,
  })
  const existingEmails = new Set(existingUsers.map((user: { email: string }) => user.email))

  const superAdminRoles = await rbacService.listRbacRoles({
    id: "role_super_admin",
  })
  const roles = superAdminRoles.length ? [superAdminRoles[0].id] : []

  for (const email of adminEmails) {
    if (existingEmails.has(email)) {
      logger.info(`Admin ${email} already exists, skipping.`)
      continue
    }

    const { result: users } = await workflowService.run("create-users-workflow", {
      input: {
        users: [
          {
            email,
            roles,
          },
        ],
      },
    })

    const { authIdentity, error } = await authService.register("emailpass", {
      body: {
        email,
        password: ADMIN_PASSWORD,
      },
    })

    if (error || !authIdentity) {
      throw new Error(`Failed to create auth identity for admin ${email}: ${error}`)
    }

    await authService.updateAuthIdentities({
      id: authIdentity.id,
      app_metadata: {
        user_id: users[0].id,
      },
    })

    logger.info(`Created demo admin ${email}.`)
  }
}

async function createDemoSellers(container: ExecArgs["container"]) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authService = container.resolve(Modules.AUTH) as any
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: existingSellers } = await query.graph({
    entity: "seller",
    fields: ["id", "email", "status"],
    filters: {
      email: sellers.map((seller) => seller.email),
    },
  })

  const existingByEmail = new Map(
    existingSellers.map((seller: { email: string }) => [seller.email, seller])
  )

  for (const seller of sellers) {
    const existingSeller = existingByEmail.get(seller.email) as
      | { id: string; status: string }
      | undefined

    if (existingSeller) {
      if (existingSeller.status === "pending_approval") {
        await approveSellerWorkflow(container).run({
          input: {
            seller_id: existingSeller.id,
          },
        })
      }

      logger.info(`Seller ${seller.email} already exists, skipping.`)
      continue
    }

    const { authIdentity, error } = await authService.register("emailpass", {
      body: {
        email: seller.email,
        password: SELLER_PASSWORD,
      },
    })

    if (error || !authIdentity) {
      throw new Error(`Failed to create auth identity for seller ${seller.email}: ${error}`)
    }

    const { result: createdSeller } = await createSellerAccountWorkflow(container).run({
      input: {
        auth_identity_id: authIdentity.id,
        member_email: seller.email,
        seller: {
          name: seller.name,
          email: seller.email,
          description: seller.description,
          currency_code: "eur",
        },
        address: {
          company: seller.name,
          first_name: seller.first_name,
          last_name: seller.last_name,
          address_1: "Demo street 1",
          city: seller.city,
          country_code: "de",
          postal_code: "01001",
        },
        professional_details: {
          corporate_name: seller.name,
          registration_number: `DEMO-${seller.email.split("@")[0].toUpperCase()}`,
          tax_id: "DEMO-TAX",
        },
      },
    })

    await approveSellerWorkflow(container).run({
      input: {
        seller_id: createdSeller.id,
      },
    })

    logger.info(`Created demo seller ${seller.email}.`)
  }
}

export default async function seedFullDemoData(args: ExecArgs) {
  const logger = args.container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Running full demo seed...")
  await seedBaseData(args)
  await createDemoAdmins(args.container)
  await createDemoSellers(args.container)
  await seedMarketplaceProducts(args)
  await seedLargeCatalog(args)
  await seedMoreProducts(args)
  logger.info("Full demo seed finished.")
}
