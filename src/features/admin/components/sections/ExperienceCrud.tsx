"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Experience } from "@/types/portfolio";
import { experienceSchema, ExperienceInput } from "../../types/adminTypes";
import { upsertExperience, deleteExperience } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "../ConfirmDialog";
import { Search } from "../Search";
import { Pagination } from "../Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface ExperienceCrudProps {
  experience: Experience[];
}

export function ExperienceCrud({ experience }: ExperienceCrudProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingExp, setEditingExp] = React.useState<Experience | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ success: boolean; message?: string } | null>(null);

  // Search & Pagination states
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 5;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { role: "", company: "", companyUrl: "", location: "", startDate: "", endDate: "", current: false, description: "", skills: "" }
  });

  const isCurrentJob = watch("current");

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingExp(null);
    reset({ id: "", role: "", company: "", companyUrl: "", location: "", startDate: "", endDate: "", current: false, description: "", skills: "" });
    setStatus(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp);
    reset({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      companyUrl: exp.companyUrl || "",
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.current ? "" : exp.endDate || "",
      current: exp.current,
      description: exp.description.join("\n"),
      skills: exp.skills.join(", "),
    });
    setStatus(null);
    setIsFormOpen(true);
  };

  const onSubmit: SubmitHandler<ExperienceInput> = async (data) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await upsertExperience(data);
      setStatus(response);
      if (response.success) {
        setIsFormOpen(false);
        reset();
      }
    } catch (err) {
      setStatus({ success: false, message: "A network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteExperience(deletingId);
    } catch (err) {
      alert("Failed to delete experience milestone.");
    } finally {
      setDeletingId(null);
    }
  };

  // Live filter and pagination slicing
  const filteredExperience = experience.filter(
    (exp) =>
      exp.role.toLowerCase().includes(search.toLowerCase()) ||
      exp.company.toLowerCase().includes(search.toLowerCase()) ||
      exp.location.toLowerCase().includes(search.toLowerCase()) ||
      exp.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredExperience.length / itemsPerPage);
  const paginatedExperience = filteredExperience.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Search value={search} onChange={setSearch} placeholder="Search by role, company, or location..." />
        <Button onClick={handleOpenAdd} size="sm" className="cursor-pointer self-stretch sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </div>

      <div className="border border-border/60 bg-muted/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground">Role</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Company</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Location</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Timeline</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExperience.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-sm text-muted-foreground">
                  No experience milestones found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedExperience.map((exp) => (
                <TableRow key={exp.id} className="border-b border-border/40 hover:bg-muted/10">
                  <TableCell className="font-bold text-foreground py-3.5">{exp.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">{exp.company}</TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">{exp.location}</TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </TableCell>
                  <TableCell className="py-3.5 text-right space-x-1.5">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(exp)} className="h-8 w-8 cursor-pointer">
                      <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(exp.id)} className="h-8 w-8 cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5 text-destructive hover:text-destructive/80" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Editor Modal */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingExp ? "Edit Experience" : "Add Experience"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {status && (
            <div
              className={`flex items-start gap-2.5 p-4 rounded-lg text-sm border ${
                status.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              {status.success ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <input type="hidden" {...register("id")} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Role / Job Title" id="role" error={errors.role?.message}>
              <Input id="role" placeholder="Senior Developer" {...register("role")} />
            </FormField>

            <FormField label="Company Name" id="company" error={errors.company?.message}>
              <Input id="company" placeholder="Tech Solutions" {...register("company")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Company Website URL" id="companyUrl" error={errors.companyUrl?.message}>
              <Input id="companyUrl" placeholder="https://example.com" {...register("companyUrl")} />
            </FormField>

            <FormField label="Location" id="location" error={errors.location?.message}>
              <Input id="location" placeholder="San Francisco, CA" {...register("location")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Start Date (YYYY-MM)" id="startDate" error={errors.startDate?.message}>
              <Input id="startDate" placeholder="2022-03" {...register("startDate")} />
            </FormField>

            {!isCurrentJob && (
              <FormField label="End Date (YYYY-MM)" id="endDate" error={errors.endDate?.message}>
                <Input id="endDate" placeholder="2024-06" {...register("endDate")} />
              </FormField>
            )}
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="current"
              {...register("current")}
              className="h-4 w-4 rounded-sm border-border bg-background/50 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="current" className="text-sm font-semibold text-foreground cursor-pointer">
              I currently work in this role
            </label>
          </div>

          <FormField label="Accomplishments (one per line)" id="description" error={errors.description?.message}>
            <Textarea id="description" placeholder="Led migrate of codebase...&#10;Mentored juniors..." rows={4} {...register("description")} />
          </FormField>

          <FormField label="Skills / Tech Used (comma separated)" id="skills" error={errors.skills?.message}>
            <Input id="skills" placeholder="React, Node.js, Docker" {...register("skills")} />
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/20">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Saving..." : "Save Job"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Job Experience?"
        message="Are you sure you want to remove this job milestone from your work timeline?"
      />
    </div>
  );
}
