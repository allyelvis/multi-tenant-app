import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Plus } from "lucide-react"
import { getCurrentUser } from "@/lib/session"
import { getTenants } from "@/lib/tenant"
import { columns } from "./columns"

export default async function TenantsPage() {
  const user = await getCurrentUser()
  const tenants = await getTenants(user.id)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tenants</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Tenant
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>Manage your organizations and their settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tenants} />
        </CardContent>
      </Card>
    </div>
  )
}

