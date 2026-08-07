"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@/types/portfolio";
import { projectSchema, ProjectInput } from "../../types/adminTypes";
import { upsertProject, deleteProject } from "../../actions";
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

interface ProjectsCrudProps {
  projects: Project[];
}

export function ProjectsCrud({ projects }: ProjectsCrudProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ success: boolean; message?: string } | null>(null);

  // Search & Pagination states
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 5;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", longDescription: "", image: "", tags: "", demoUrl: "", githubUrl: "", featured: false }
  });

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingProject(null);
    reset({ id: "", title: "", description: "", longDescription: "", image: "", tags: "", demoUrl: "", githubUrl: "", featured: false });
    setStatus(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    reset({
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      image: project.image,
      tags: project.tags.join(", "),
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      featured: project.featured,
    });
    setStatus(null);
    setIsFormOpen(true);
  };

  const onSubmit: SubmitHandler<ProjectInput> = async (data) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await upsertProject(data);
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
      await deleteProject(deletingId);
    } catch (err) {
      alert("Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  // Live filter and pagination slicing
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Search value={search} onChange={setSearch} placeholder="Search by title, description, or tags..." />
        <Button onClick={handleOpenAdd} size="sm" className="cursor-pointer self-stretch sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="border border-border/60 bg-muted/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground">Title</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Description</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Tags</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                  No projects found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProjects.map((project) => (
                <TableRow key={project.id} className="border-b border-border/40 hover:bg-muted/10">
                  <TableCell className="font-bold text-foreground py-3.5 flex items-center gap-2.5">
                    {project.title}
                    {project.featured && (
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                        Featured
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5 max-w-xs truncate">
                    {project.description}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground border border-border/20 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-right space-x-1.5">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(project)} className="h-8 w-8 cursor-pointer">
                      <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(project.id)} className="h-8 w-8 cursor-pointer">
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
        title={editingProject ? "Edit Project" : "Add Project"}
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
            <FormField label="Project Title" id="title" error={errors.title?.message}>
              <Input id="title" placeholder="Project Name" {...register("title")} />
            </FormField>

            <FormField label="Image URL" id="image" error={errors.image?.message}>
              <Input id="image" placeholder="https://unsplash.com/..." {...register("image")} />
            </FormField>
          </div>

          <FormField label="Short Description" id="description" error={errors.description?.message}>
            <Textarea id="description" placeholder="Brief outline..." rows={2} {...register("description")} />
          </FormField>

          <FormField label="Detailed Description (Optional)" id="longDescription" error={errors.longDescription?.message}>
            <Textarea id="longDescription" placeholder="Detailed achievements, technologies, or architectures..." rows={4} {...register("longDescription")} />
          </FormField>

          <FormField label="Tags / Technologies (comma separated)" id="tags" error={errors.tags?.message}>
            <Input id="tags" placeholder="Next.js, TypeScript, Go" {...register("tags")} />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Live Demo URL" id="demoUrl" error={errors.demoUrl?.message}>
              <Input id="demoUrl" placeholder="https://example.com" {...register("demoUrl")} />
            </FormField>

            <FormField label="Source Code URL" id="githubUrl" error={errors.githubUrl?.message}>
              <Input id="githubUrl" placeholder="https://github.com/..." {...register("githubUrl")} />
            </FormField>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="featured"
              {...register("featured")}
              className="h-4 w-4 rounded-sm border-border bg-background/50 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-foreground cursor-pointer">
              Feature this project on the homepage
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/20">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Project?"
        message="Are you sure you want to remove this project from your showcase?"
      />
    </div>
  );
}
