"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { updateTenantBilling } from "@/lib/tenant"

const formSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"]),
  billingCycle: z.enum(["monthly", "yearly"]),
})

interface BillingSettingsFormProps {
  tenant: {
    id: string
    name: string
    billing?: {
      plan?: string
      billingCycle?: string
    }
  }
}

export function BillingSettingsForm({ tenant }: BillingSettingsFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: (tenant.billing?.plan as any) || "free",
      billingCycle: (tenant.billing?.billingCycle as any) || "monthly",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateTenantBilling(tenant.id, values)
      toast({
        title: "Billing settings updated",
        description: "Your organization's billing settings have been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update billing settings",
        description: "There was an error updating your billing settings.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Subscription Plan</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="free" />
                    </FormControl>
                    <FormLabel className="font-normal">Free - $0/month</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pro" />
                    </FormControl>
                    <FormLabel className="font-normal">Pro - $15/month per user</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="enterprise" />
                    </FormControl>
                    <FormLabel className="font-normal">Enterprise - Contact sales</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billingCycle"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Billing Cycle</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="monthly" />
                    </FormControl>
                    <FormLabel className="font-normal">Monthly</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yearly" />
                    </FormControl>
                    <FormLabel className="font-normal">Yearly (Save 10%)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>You can change your billing cycle at any time.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  )
}

