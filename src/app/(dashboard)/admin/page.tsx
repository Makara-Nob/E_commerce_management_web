"use client";

import React, { useEffect } from "react";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Inbox
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useDashboardState } from "@/redux/features/dashboard/store/state/dashboard-state";
import { fetchDashboardSummaryService } from "@/redux/features/dashboard/store/thunks/dashboard-thunks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminDashboardPage() {
    const { data, isLoading, dispatch } = useDashboardState();

    useEffect(() => {
        dispatch(fetchDashboardSummaryService());
    }, [dispatch]);

    const stats = [
        {
            title: "Total Revenue",
            value: `$${data?.summary?.totalRevenue?.toLocaleString() || "0"}`,
            icon: DollarSign,
            trend: "+12.5%",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            gradient: "from-emerald-500/20 to-transparent"
        },
        {
            title: "Total Orders",
            value: data?.summary?.totalOrders?.toLocaleString() || "0",
            icon: ShoppingCart,
            trend: "+8.2%",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            gradient: "from-blue-500/20 to-transparent"
        },
        {
            title: "Total Customers",
            value: data?.summary?.totalCustomers?.toLocaleString() || "0",
            icon: Users,
            trend: "+5.1%",
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
            gradient: "from-purple-500/20 to-transparent"
        },
        {
            title: "Active Inventory",
            value: data?.summary?.totalProducts?.toLocaleString() || "0",
            icon: Package,
            trend: "Stable",
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "border-orange-100",
            gradient: "from-orange-500/20 to-transparent"
        }
    ];

    if (isLoading && !data) {
        return (
            <div className="p-6 space-y-8 animate-in fade-in duration-500">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
                    <Skeleton className="h-[400px] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 font-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        Last update: {format(new Date(), "PPpp")}
                    </p>
                </div>
                <Badge variant="outline" className="w-fit px-4 py-1.5 border-primary/20 bg-primary/5 text-primary animate-pulse">
                    Live Updates Enabled
                </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className={cn(
                        "relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
                        stat.border
                    )}>
                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", stat.gradient)} />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={cn("p-2 rounded-lg relative transition-transform duration-300 group-hover:scale-110", stat.bg, stat.color)}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full", stat.bg, stat.color)}>
                                    {stat.trend}
                                </span>
                                <span className="text-[10px] text-muted-foreground">vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2 shadow-sm border-border/50 overflow-hidden bg-gradient-to-b from-card to-card/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Sales Performance
                            </CardTitle>
                            <CardDescription>Daily revenue trends for the past 7 days</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                            Revenue (USD)
                        </Badge>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.salesTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
                                        tickFormatter={(str) => format(new Date(str), "MMM d")}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: "hsl(var(--card))", 
                                            borderColor: "hsl(var(--border))",
                                            borderRadius: "12px",
                                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                            fontSize: "12px",
                                            fontWeight: "bold"
                                        }} 
                                        labelFormatter={(label) => format(new Date(label), "PPPP")}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="hsl(var(--primary))" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="shadow-sm border-border/50 bg-gradient-to-b from-card to-card/50 h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Recent Orders</CardTitle>
                            <CardDescription>Latest customer activity</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-1 text-xs px-2">
                            View All <ChevronRight className="w-3 h-3" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {(data?.recentOrders || []).map((order, i) => (
                                <div key={order.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="w-10 h-10 border-2 border-background shadow-sm group-hover:border-primary/20 transition-colors">
                                                <AvatarImage src={order.customerProfile} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                    {order.customerName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold group-hover:text-primary transition-colors">{order.customerName}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">#{order.invoiceNumber}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-sm font-black text-foreground">${order.amount.toFixed(2)}</span>
                                        <Badge variant="outline" className={cn(
                                            "text-[9px] py-0 px-1.5 font-bold uppercase",
                                            order.status === 'DELIVERED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                            order.status === 'SHIPPED' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                            "bg-orange-50 text-orange-600 border-orange-200"
                                        )}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}

                            {(!data || (data?.recentOrders?.length === 0)) && (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Inbox className="w-6 h-6 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">No recent orders yet</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 relative overflow-hidden group cursor-pointer">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                <ArrowUpRight className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Quick Insight</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Your sales are up <span className="text-primary font-black">12%</span> compared to last week. 
                                Keep focusing on category performance!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
