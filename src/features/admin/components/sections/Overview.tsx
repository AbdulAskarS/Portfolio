"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileCode, Hammer, Briefcase, Award, BookOpen, Mail, Clock, MessageSquare, Download } from "lucide-react";

interface OverviewProps {
  counts: {
    projects: number;
    skills: number;
    experience: number;
    certificates: number;
    blogs: number;
    testimonials: number;
  };
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
  }>;
}

export function Overview({ counts, messages }: OverviewProps) {
  const statCards = [
    { label: "Projects", count: counts.projects, icon: FileCode, color: "text-blue-500" },
    { label: "Skills", count: counts.skills, icon: Hammer, color: "text-emerald-500" },
    { label: "Work Experience", count: counts.experience, icon: Briefcase, color: "text-purple-500" },
    { label: "Certifications", count: counts.certificates, icon: Award, color: "text-amber-500" },
    { label: "Blogs", count: counts.blogs, icon: BookOpen, color: "text-pink-500" },
    { label: "Testimonials", count: counts.testimonials, icon: MessageSquare, color: "text-violet-500" },
  ];

  const sortedMessages = [...messages].sort((a, b) => b.date.localeCompare(a.date));

  const exportToCSV = () => {
    if (sortedMessages.length === 0) return;

    const headers = ["ID", "Date", "Sender Name", "Email", "Subject", "Message"];
    const rows = sortedMessages.map((msg) => [
      msg.id,
      new Date(msg.date).toISOString(),
      msg.name,
      msg.email,
      msg.subject,
      msg.message.replace(/\r?\n|\r/g, " "), // Replace line breaks with spaces
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `contact_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border border-border/60 bg-muted/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <span className="text-sm font-semibold text-muted-foreground">{card.label}</span>
                <Icon className={`h-4.5 w-4.5 ${card.color}`} aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-extrabold text-foreground">{card.count}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Submissions */}
      <Card className="border border-border/60 bg-muted/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
            Contact Messages
          </CardTitle>
          {sortedMessages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="cursor-pointer flex items-center gap-1.5 text-xs h-8"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export CSV
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {sortedMessages.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No contact submissions found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/40 hover:bg-transparent">
                  <TableHead className="font-semibold text-muted-foreground">Sender</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Subject</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Message</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMessages.map((msg) => (
                  <TableRow key={msg.id} className="border-b border-border/40 hover:bg-muted/10">
                    <TableCell className="align-top py-4">
                      <div className="font-bold text-sm text-foreground">{msg.name}</div>
                      <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline">
                        {msg.email}
                      </a>
                    </TableCell>
                    <TableCell className="align-top py-4 font-semibold text-foreground text-sm">
                      {msg.subject}
                    </TableCell>
                    <TableCell className="align-top py-4 text-sm text-muted-foreground max-w-sm leading-relaxed whitespace-pre-line">
                      {msg.message}
                    </TableCell>
                    <TableCell className="align-top py-4 text-right text-xs text-muted-foreground flex items-center justify-end gap-1.5 pt-4.5">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
