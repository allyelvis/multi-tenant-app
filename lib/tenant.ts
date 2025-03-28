import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decryptData, encryptData } from "./encryption"

export async function getCurrentTenant() {
  const session = cookies().get("session")?.value

  if (!session) {
    redirect("/login")
  }

  try {
    const { tenant } = JSON.parse(decryptData(session))

    if (!tenant) {
      // If no tenant is found in the session, use a default one for demo purposes
      return {
        id: "tenant_default",
        name: "Demo Organization",
        stats: {
          totalUsers: 24,
          newUsers: 5,
          activeProjects: 12,
          newProjects: 3,
          storageUsed: 2.5,
          storageLimit: 10,
          apiRequests: 45678,
          apiRequestsChange: 12,
        },
        overviewData: [
          { name: "Jan", value: 2400 },
          { name: "Feb", value: 1398 },
          { name: "Mar", value: 9800 },
          { name: "Apr", value: 3908 },
          { name: "May", value: 4800 },
          { name: "Jun", value: 3800 },
          { name: "Jul", value: 4300 },
        ],
        recentActivity: [
          { id: 1, action: "User Login", user: "John Doe", time: "2 hours ago" },
          { id: 2, action: "Project Created", user: "Jane Smith", time: "5 hours ago" },
          { id: 3, action: "Settings Updated", user: "Admin", time: "1 day ago" },
          { id: 4, action: "User Invited", user: "John Doe", time: "2 days ago" },
          { id: 5, action: "API Key Generated", user: "System", time: "3 days ago" },
        ],
      }
    }

    // In a real app, you would fetch the tenant data from the database
    // For demo purposes, we'll add some mock data
    return {
      ...tenant,
      stats: {
        totalUsers: 24,
        newUsers: 5,
        activeProjects: 12,
        newProjects: 3,
        storageUsed: 2.5,
        storageLimit: 10,
        apiRequests: 45678,
        apiRequestsChange: 12,
      },
      overviewData: [
        { name: "Jan", value: 2400 },
        { name: "Feb", value: 1398 },
        { name: "Mar", value: 9800 },
        { name: "Apr", value: 3908 },
        { name: "May", value: 4800 },
        { name: "Jun", value: 3800 },
        { name: "Jul", value: 4300 },
      ],
      recentActivity: [
        { id: 1, action: "User Login", user: "John Doe", time: "2 hours ago" },
        { id: 2, action: "Project Created", user: "Jane Smith", time: "5 hours ago" },
        { id: 3, action: "Settings Updated", user: "Admin", time: "1 day ago" },
        { id: 4, action: "User Invited", user: "John Doe", time: "2 days ago" },
        { id: 5, action: "API Key Generated", user: "System", time: "3 days ago" },
      ],
    }
  } catch (error) {
    redirect("/login")
  }
}

export async function getTenants(userId: string) {
  // In a real app, this would fetch tenants from the database
  // For demo purposes, we'll return mock data
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "tenant_1",
      name: "Acme Inc.",
      domain: "acme.aenzbi.com",
      plan: "pro",
      status: "active",
      createdAt: "2023-01-15",
      usersCount: 12,
    },
    {
      id: "tenant_2",
      name: "Globex Corporation",
      domain: "",
      plan: "enterprise",
      status: "active",
      createdAt: "2023-02-20",
      usersCount: 45,
    },
    {
      id: "tenant_3",
      name: "Initech",
      domain: "initech.aenzbi.com",
      plan: "free",
      status: "active",
      createdAt: "2023-03-10",
      usersCount: 3,
    },
  ]
}

export async function createTenant(name: string) {
  // In a real app, this would create a new tenant in the database
  // For demo purposes, we'll return a mock tenant
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newTenant = {
    id: "tenant_" + Math.random().toString(36).substring(2, 9),
    name,
  }

  // Update the session with the new tenant
  const session = cookies().get("session")?.value

  if (session) {
    const sessionData = JSON.parse(decryptData(session))

    cookies().set(
      "session",
      encryptData(
        JSON.stringify({
          ...sessionData,
          tenant: newTenant,
        }),
      ),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )
  }

  return newTenant
}

export async function updateTenantSettings(tenantId: string, settings: any) {
  // In a real app, this would update the tenant settings in the database
  // For demo purposes, we'll just simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Update the session with the new tenant settings
  const session = cookies().get("session")?.value

  if (session) {
    const sessionData = JSON.parse(decryptData(session))

    if (sessionData.tenant?.id === tenantId) {
      cookies().set(
        "session",
        encryptData(
          JSON.stringify({
            ...sessionData,
            tenant: {
              ...sessionData.tenant,
              ...settings,
            },
          }),
        ),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        },
      )
    }
  }
}

export async function updateTenantBranding(tenantId: string, branding: any) {
  // In a real app, this would update the tenant branding in the database
  // For demo purposes, we'll just simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Update the session with the new tenant branding
  const session = cookies().get("session")?.value

  if (session) {
    const sessionData = JSON.parse(decryptData(session))

    if (sessionData.tenant?.id === tenantId) {
      cookies().set(
        "session",
        encryptData(
          JSON.stringify({
            ...sessionData,
            tenant: {
              ...sessionData.tenant,
              branding,
            },
          }),
        ),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        },
      )
    }
  }
}

export async function updateTenantSecurity(tenantId: string, security: any) {
  // In a real app, this would update the tenant security settings in the database
  // For demo purposes, we'll just simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Update the session with the new tenant security settings
  const session = cookies().get("session")?.value

  if (session) {
    const sessionData = JSON.parse(decryptData(session))

    if (sessionData.tenant?.id === tenantId) {
      cookies().set(
        "session",
        encryptData(
          JSON.stringify({
            ...sessionData,
            tenant: {
              ...sessionData.tenant,
              security,
            },
          }),
        ),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        },
      )
    }
  }
}

export async function updateTenantBilling(tenantId: string, billing: any) {
  // In a real app, this would update the tenant billing settings in the database
  // For demo purposes, we'll just simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Update the session with the new tenant billing settings
  const session = cookies().get("session")?.value

  if (session) {
    const sessionData = JSON.parse(decryptData(session))

    if (sessionData.tenant?.id === tenantId) {
      cookies().set(
        "session",
        encryptData(
          JSON.stringify({
            ...sessionData,
            tenant: {
              ...sessionData.tenant,
              billing,
            },
          }),
        ),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        },
      )
    }
  }
}

