"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import type { Permission } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Role name must be at least 2 characters.",
  }),
  permissions: z.array(z.string()).min(1, {
    message: "Select at least one permission.",
  }),
});

interface RoleFormProps {
  permissions: Permission[];
}

export function RoleForm({ permissions }: RoleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create role");
      }

      toast({
        title: "Success",
        description: "Role created successfully",
      });

      router.push("/dashboard/roles");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter role name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the role that will be displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Permissions</FormLabel>
          <FormDescription>
            Select the permissions for this role.
          </FormDescription>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-lg p-4">
            {permissions.map((permission) => (
              <FormField
                key={permission.id}
                control={form.control}
                name="permissions"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={permission.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, permission.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== permission.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {permission.name}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage>
            {form.formState.errors.permissions?.message}
          </FormMessage>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create role"}
        </Button>
      </form>
    </Form>
  );
}