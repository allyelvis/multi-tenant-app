"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { updateTenantSettings } from "@/lib/tenant"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  domain: z.string().optional(),
  description: z.string().optional(),
})

interface TenantSettingsFormProps {
  tenant: {
    id: string
    name: string
    domain?: string
    description?: string
  }
}

export function TenantSettingsForm({ tenant }: TenantSettingsFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tenant.name,
      domain: tenant.domain || "",
      description: tenant.description || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateTenantSettings(tenant.id, values)
      toast({
        title: "Settings updated",
        description: "Your organization settings have been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update settings",
        description: "There was an error updating your settings.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>This is the name of your organization.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The domain associated with your organization.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>A brief description of your organization.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  )
}

