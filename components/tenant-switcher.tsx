"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { createTenant } from "@/lib/tenant"

type Tenant = {
  id: string
  name: string
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TenantSwitcherProps extends PopoverTriggerProps {
  tenants?: Tenant[]
  currentTenant?: Tenant
  defaultOpen?: boolean
}

export function TenantSwitcher({ className, tenants = [], currentTenant, defaultOpen, ...props }: TenantSwitcherProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(defaultOpen || false)
  const [showNewTenantDialog, setShowNewTenantDialog] = React.useState(false)
  const [selectedTenant, setSelectedTenant] = React.useState<Tenant | undefined>(currentTenant)
  const { toast } = useToast()

  const [tenantsList, setTenantsList] = React.useState<Tenant[]>(tenants)

  const handleCreateTenant = async (name: string) => {
    try {
      const newTenant = await createTenant(name)
      setTenantsList([...tenantsList, newTenant])
      setSelectedTenant(newTenant)
      setShowNewTenantDialog(false)
      toast({
        title: "Tenant created",
        description: `${name} has been created successfully.`,
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create tenant",
        description: "There was an error creating the tenant.",
      })
    }
  }

  const onTenantSelect = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setOpen(false)
    router.push(`/dashboard?tenant=${tenant.id}`)
    router.refresh()
  }

  return (
    <Dialog open={showNewTenantDialog} onOpenChange={setShowNewTenantDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a tenant"
            className={cn("w-[200px] justify-between", className)}
            {...props}
          >
            {selectedTenant?.name || "Select organization"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search organization..." />
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup heading="Organizations">
                {tenantsList.map((tenant) => (
                  <CommandItem key={tenant.id} onSelect={() => onTenantSelect(tenant)} className="text-sm">
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedTenant?.id === tenant.id ? "opacity-100" : "opacity-0")}
                    />
                    {tenant.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem onSelect={() => setShowNewTenantDialog(true)} className="cursor-pointer">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Organization
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>Add a new organization to manage products and customers.</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTenantDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleCreateTenant((document.getElementById("name") as HTMLInputElement).value)}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

