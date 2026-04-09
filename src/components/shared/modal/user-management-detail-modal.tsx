"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  Activity,
  Briefcase,
  Notebook,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { UserModel } from "@/redux/features/auth/store/models/response/users-response";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Badge } from "@/components/ui/badge";
import { CustomAvatar } from "@/components/shared/common/custom-avator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserManagementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserModel | null;
}

export function UserManagementDetailModal({
  isOpen,
  onClose,
  user,
}: UserManagementDetailModalProps) {
  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "SUSPENDED": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] flex flex-col max-h-[90vh] p-0 font-primary overflow-hidden">
        <DialogHeader className="flex-shrink-0 px-8 pt-8 pb-6 border-b bg-muted/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <CustomAvatar
              imageUrl={user.profileUrl}
              name={user.fullName}
              size="xl"
              className="w-24 h-24 border-4 border-background shadow-xl"
            />
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                 <DialogTitle className="text-3xl font-bold tracking-tight">
                    {user.fullName}
                 </DialogTitle>
                 <Badge variant="outline" className="bg-background text-[10px] py-0 px-2 uppercase font-bold tracking-wider">
                    {user.username}
                 </Badge>
              </div>
              <DialogDescription className="text-base text-muted-foreground">
                {user.position || "Member"} at your organization
              </DialogDescription>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  {getStatusIcon(user.status)}
                  <span className={user.status === 'ACTIVE' ? "text-emerald-600" : "text-muted-foreground"}>
                    {user.status}
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden md:block" />
                <div className="flex items-center gap-2">
                  {user.roles.map(role => (
                    <Badge key={role} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 py-0 text-[10px] font-bold">
                       {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-8">
            {/* Contact Details */}
            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Contact Information
               </h4>
               <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-muted rounded">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-muted rounded">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</p>
                      <p className="text-sm font-medium">{user.phone || "---"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-muted rounded">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Office Location</p>
                      <p className="text-sm font-medium leading-relaxed">{user.address || "No office address specified."}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Account Details */}
            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Account Details
               </h4>
               <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-muted rounded">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Current Position</p>
                      <p className="text-sm font-medium">{user.position || "---"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-muted rounded">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Member Since</p>
                      <p className="text-sm font-medium">{dateTimeFormat(user.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-muted rounded">
                      <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Permission Level</p>
                      <Badge variant="outline" className="mt-1 bg-primary/5 border-primary/20 text-primary capitalize font-bold text-[9px] py-0 px-2">
                        {user.userPermission || "NORMAL"}
                      </Badge>
                    </div>
                  </div>
               </div>
            </div>

            {/* Full width Notes */}
            {user.notes && (
              <div className="md:col-span-2 space-y-3 pt-4 border-t">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                    <Notebook className="w-3.5 h-3.5" /> Internal Documentation
                 </h4>
                 <div className="bg-muted/30 rounded-xl p-4 text-sm leading-relaxed text-muted-foreground">
                    {user.notes}
                 </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 px-8 py-6 border-t bg-muted/20">
          <Button type="button" variant="default" onClick={onClose} className="px-8 font-bold">
            Close Overview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
