import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("password123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@aenzbi.com" },
    update: {},
    create: {
      email: "admin@aenzbi.com",
      name: "Admin User",
      passwordHash: adminPassword,
      status: "active",
    },
  })

  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo",
      description: "A demo organization for testing purposes",
      plan: "pro",
      status: "active",
    },
  })

  // Associate admin with demo tenant
  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: demoTenant.id,
        userId: admin.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      userId: admin.id,
      role: "admin",
      status: "active",
    },
  })

  // Create tenant config
  await prisma.tenantConfig.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      theme: {
        primaryColor: "#4f46e5",
        secondaryColor: "#10b981",
        logoUrl: "",
      },
      features: {
        analytics: true,
        apiAccess: true,
        customDomain: false,
      },
      settings: {
        mfaEnabled: false,
        ssoEnabled: false,
        passwordPolicyEnabled: true,
        sessionTimeout: true,
      },
    },
  })

  console.log("Database seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

