import type { User } from "@/app/dashboard/users/columns"

// This is a mock data service
// In a real application, this would fetch data from your database

export async function getUsersForTenant(tenantId: string): Promise<User[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock data
  return [
    {
      id: "user_1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      lastActive: "Today at 2:34 PM",
    },
    {
      id: "user_2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Member",
      status: "active",
      lastActive: "Today at 11:15 AM",
    },
    {
      id: "user_3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Viewer",
      status: "inactive",
      lastActive: "Yesterday at 3:20 PM",
    },
    {
      id: "user_4",
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Member",
      status: "active",
      lastActive: "Today at 9:45 AM",
    },
    {
      id: "user_5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Member",
      status: "pending",
      lastActive: "Never",
    },
  ]
}

