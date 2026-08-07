import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 w-48 bg-muted rounded-md mb-8" />
      
      {/* Skeleton cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border border-border/40 bg-muted/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="h-4 w-16 bg-muted rounded-md" />
              <div className="h-4.5 w-4.5 bg-muted rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-muted rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Table skeleton */}
      <Card className="border border-border/40 bg-muted/10 mt-8">
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between border-b border-border/10 pb-4">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-muted rounded-md" />
                <div className="h-3 w-28 bg-muted rounded-md" />
              </div>
              <div className="h-4 w-12 bg-muted rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
