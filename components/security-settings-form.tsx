"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { updateTenantSecurity } from "@/lib/tenant"

const formSchema = z.object({
  mfaEnabled: z.boolean().default(false),
  ssoEnabled: z.boolean().default(false),
  passwordPolicyEnabled: z.boolean().default(false),
  sessionTimeout: z.boolean().default(false),
})

interface SecuritySettingsFormProps {
  tenant: {
    id: string
    name: string
    security?: {
      mfaEnabled?: boolean
      ssoEnabled?: boolean
      passwordPolicyEnabled?: boolean
      sessionTimeout?: boolean
    }
  }
}

export function SecuritySettingsForm({ tenant }: SecuritySettingsFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mfaEnabled: tenant.security?.mfaEnabled || false,
      ssoEnabled: tenant.security?.ssoEnabled || false,
      passwordPolicyEnabled: tenant.security?.passwordPolicyEnabled || false,
      sessionTimeout: tenant.security?.sessionTimeout || false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateTenantSecurity(tenant.id, values)
      toast({
        title: "Security settings updated",
        description: "Your organization's security settings have been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update security settings",
        description: "There was an error updating your security settings.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="mfaEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Multi-Factor Authentication</FormLabel>
                <FormDescription>Require MFA for all users in your organization.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ssoEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Single Sign-On</FormLabel>
                <FormDescription>Enable SSO for your organization.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordPolicyEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Password Policy</FormLabel>
                <FormDescription>Enforce strong password requirements.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sessionTimeout"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Session Timeout</FormLabel>
                <FormDescription>Automatically log out inactive users after 30 minutes.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  )
}

