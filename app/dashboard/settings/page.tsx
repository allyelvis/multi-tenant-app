import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TenantSettingsForm } from "@/components/tenant-settings-form"
import { SecuritySettingsForm } from "@/components/security-settings-form"
import { BillingSettingsForm } from "@/components/billing-settings-form"
import { BrandingSettingsForm } from "@/components/branding-settings-form"
import { getCurrentTenant } from "@/lib/tenant"

export default async function SettingsPage() {
  const tenant = await getCurrentTenant()

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Settings</CardTitle>
              <CardDescription>Manage your organization's general settings and information.</CardDescription>
            </CardHeader>
            <CardContent>
              <TenantSettingsForm tenant={tenant} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize your organization's branding and appearance.</CardDescription>
            </CardHeader>
            <CardContent>
              <BrandingSettingsForm tenant={tenant} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your organization's security settings and policies.</CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettingsForm tenant={tenant} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>Manage your organization's billing information and subscription.</CardDescription>
            </CardHeader>
            <CardContent>
              <BillingSettingsForm tenant={tenant} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

