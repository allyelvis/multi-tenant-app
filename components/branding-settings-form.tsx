"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { updateTenantBranding } from "@/lib/tenant"

const formSchema = z.object({
  logoUrl: z.string().optional(),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Must be a valid hex color code",
  }),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Must be a valid hex color code",
  }),
  customDomain: z.string().optional(),
})

interface BrandingSettingsFormProps {
  tenant: {
    id: string
    name: string
    branding?: {
      logoUrl?: string
      primaryColor?: string
      secondaryColor?: string
      customDomain?: string
    }
  }
}

export function BrandingSettingsForm({ tenant }: BrandingSettingsFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logoUrl: tenant.branding?.logoUrl || "",
      primaryColor: tenant.branding?.primaryColor || "#4f46e5",
      secondaryColor: tenant.branding?.secondaryColor || "#10b981",
      customDomain: tenant.branding?.customDomain || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateTenantBranding(tenant.id, values)
      toast({
        title: "Branding updated",
        description: "Your organization's branding has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update branding",
        description: "There was an error updating your branding settings.",
      })
    }
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("tenantId", tenant.id)

      const response = await fetch("/api/tenants/upload-logo", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { logoUrl } = await response.json()
      form.setValue("logoUrl", logoUrl)

      toast({
        title: "Logo uploaded",
        description: "Your organization logo has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your logo.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Logo</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {field.value && (
                    <img
                      src={field.value || "/placeholder.svg"}
                      alt="Organization logo"
                      className="h-12 w-12 object-contain"
                    />
                  )}
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploading} />
                </div>
              </FormControl>
              <FormDescription>Upload your organization logo (recommended size: 512x512px)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: field.value }} />
                    <Input type="text" {...field} />
                  </div>
                </FormControl>
                <FormDescription>Main brand color used for buttons and accents</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: field.value }} />
                    <Input type="text" {...field} />
                  </div>
                </FormControl>
                <FormDescription>Secondary brand color used for highlights</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="customDomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Domain</FormLabel>
              <FormControl>
                <Input {...field} placeholder="app.yourcompany.com" />
              </FormControl>
              <FormDescription>
                Enterprise plan only. Enter your custom domain to use instead of the default subdomain.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUploading}>
          Save branding settings
        </Button>
      </form>
    </Form>
  )
}

