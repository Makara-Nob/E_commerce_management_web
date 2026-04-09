"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, UserPlus, Shield, User, Lock, Mail, Phone, Briefcase, MapPin, Notebook } from "lucide-react";
import { 
  createUserSchema, 
  updateUserSchema, 
  UserFormData 
} from "@/models/dashboard/user/plateform-user/user.schema";
import { UserModel } from "@/redux/features/auth/store/models/response/users-response";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  user: UserModel | null;
  isSubmitting: boolean;
}

const AVAILABLE_ROLES = [
  { id: "ADMIN", label: "Administrator" },
  { id: "STAFF", label: "Support Staff" },
  { id: "CUSTOMER", label: "Customer" },
];

export function UserManagementModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isSubmitting,
}: UserManagementModalProps) {
  const isEdit = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema) as any,
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      phone: "",
      roles: ["STAFF"],
      status: "ACTIVE",
      position: "",
      address: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || "",
        roles: user.roles || ["STAFF"],
        status: user.status as any || "ACTIVE",
        position: user.position || "",
        address: user.address || "",
        notes: user.notes || "",
      });
    } else if (isOpen) {
      form.reset({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phone: "",
        roles: ["STAFF"],
        status: "ACTIVE",
        position: "",
        address: "",
        notes: "",
      });
    }
  }, [user, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] flex flex-col max-h-[90vh] p-0 overflow-hidden font-primary">
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-primary" />
             </div>
             <div>
                <DialogTitle className="text-xl">
                  {isEdit ? "Update User Account" : "Create New User"}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isEdit ? "Modify system access and profile details" : "Register a new user with specific role permissions"}
                </p>
             </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-6 px-6 py-6">
              {/* Account Credentials Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                   <Lock className="w-4 h-4" /> Account Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="johndoe" className="pl-9" disabled={isEdit} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!isEdit && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Password *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className={isEdit ? "md:col-span-2" : ""}>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="user@example.com" className="pl-9" disabled={isEdit} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-primary pt-2 border-t mt-2">
                   <User className="w-4 h-4" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="+1 234 567 890" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Sales Representative" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Primary Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                             <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                             <Input placeholder="Street, City, Country" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Permissions & Status Section */}
              <div className="space-y-4 pt-2 border-t mt-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                   <Shield className="w-4 h-4" /> Permissions & Access
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="roles"
                    render={() => (
                      <FormItem className="space-y-3">
                        <FormLabel>Assign Roles *</FormLabel>
                        <div className="grid grid-cols-1 gap-2 border rounded-lg p-3 bg-muted/10">
                          {AVAILABLE_ROLES.map((role) => (
                            <FormField
                              key={role.id}
                              control={form.control}
                              name="roles"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={role.id}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(role.id) || false}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), role.id])
                                            : field.onChange(
                                                (field.value || []).filter(
                                                  (value) => value !== role.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-xs font-normal cursor-pointer">
                                      {role.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Active Account</SelectItem>
                              <SelectItem value="INACTIVE">Inactive / Disabled</SelectItem>
                              <SelectItem value="SUSPENDED">Suspended / Banned</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internal Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any internal documentation..." 
                              className="resize-none h-[72px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 border-t px-6 py-4 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isDirty}
            className="min-w-[140px]"
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
