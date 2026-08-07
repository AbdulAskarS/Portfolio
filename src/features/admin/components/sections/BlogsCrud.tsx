"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Blog } from "@/types/portfolio";
import { blogSchema, BlogInput } from "../../types/adminTypes";
import { upsertBlog, deleteBlog } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "../ConfirmDialog";
import { Search } from "../Search";
import { Pagination } from "../Pagination";
import { MarkdownPreview } from "../MarkdownPreview";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface BlogsCrudProps {
  blogs: Blog[];
}

export function BlogsCrud({ blogs }: BlogsCrudProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBlog, setEditingBlog] = React.useState<Blog | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ success: boolean; message?: string } | null>(null);

  // Search & Pagination states
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 5;

  // Editor Modal Tab Toggle
  const [editorTab, setEditorTab] = React.useState<"write" | "preview">("write");

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", description: "", content: "", date: "", readTime: "", image: "", tags: "", published: false }
  });

  const articleContent = watch("content") || "";

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setEditorTab("write");
    reset({ id: "", title: "", description: "", content: "", date: "", readTime: "", image: "", tags: "", published: false });
    setStatus(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setEditorTab("write");
    reset({
      id: blog.id,
      title: blog.title,
      description: blog.description,
      content: blog.content,
      date: blog.date,
      readTime: blog.readTime,
      image: blog.image,
      tags: blog.tags.join(", "),
      published: blog.published,
    });
    setStatus(null);
    setIsFormOpen(true);
  };

  const onSubmit: SubmitHandler<BlogInput> = async (data) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await upsertBlog(data);
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
      await deleteBlog(deletingId);
    } catch (err) {
      alert("Failed to delete blog article.");
    } finally {
      setDeletingId(null);
    }
  };

  // Live filter and pagination slicing
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Search value={search} onChange={setSearch} placeholder="Search by title, description, or tags..." />
        <Button onClick={handleOpenAdd} size="sm" className="cursor-pointer self-stretch sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Article
        </Button>
      </div>

      <div className="border border-border/60 bg-muted/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground">Title</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Date</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBlogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                  No articles found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedBlogs.map((blog) => (
                <TableRow key={blog.id} className="border-b border-border/40 hover:bg-muted/10">
                  <TableCell className="font-bold text-foreground py-3.5 max-w-sm truncate">{blog.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">{blog.date}</TableCell>
                  <TableCell className="py-3.5">
                    {blog.published ? (
                      <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                        Published
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground border border-border/20 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 text-right space-x-1.5">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(blog)} className="h-8 w-8 cursor-pointer">
                      <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(blog.id)} className="h-8 w-8 cursor-pointer">
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
        title={editingBlog ? "Edit Article" : "Write Article"}
        className="max-w-3xl"
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
            <FormField label="Article Title" id="title" error={errors.title?.message}>
              <Input id="title" placeholder="Migration to..." {...register("title")} />
            </FormField>

            <FormField label="Banner Image URL" id="image" error={errors.image?.message}>
              <Input id="image" placeholder="https://..." {...register("image")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Publish Date (YYYY-MM-DD)" id="date" error={errors.date?.message}>
              <Input id="date" placeholder="2026-07-15" {...register("date")} />
            </FormField>

            <FormField label="Read Time (e.g. 5 min read)" id="readTime" error={errors.readTime?.message}>
              <Input id="readTime" placeholder="6 min read" {...register("readTime")} />
            </FormField>
          </div>

          <FormField label="Short Description" id="description" error={errors.description?.message}>
            <Textarea id="description" placeholder="Brief metadata outline..." rows={2} {...register("description")} />
          </FormField>

          {/* Write / Preview Tab system */}
          <div className="space-y-2">
            <div className="flex border-b border-border/40 gap-2 pb-1.5">
              <button
                type="button"
                onClick={() => setEditorTab("write")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  editorTab === "write"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Write (Editor)
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("preview")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  editorTab === "preview"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Preview Rendering
              </button>
            </div>

            {editorTab === "write" ? (
              <FormField label="Markdown Content" id="content" error={errors.content?.message}>
                <Textarea id="content" placeholder="Write article content here... (supports basic markdown: #, ##, -, >, **, *)" rows={10} {...register("content")} />
              </FormField>
            ) : (
              <div className="border border-border/40 rounded-lg p-4.5 min-h-[220px] max-h-[350px] overflow-y-auto bg-muted/5">
                <MarkdownPreview content={articleContent} />
              </div>
            )}
          </div>

          <FormField label="Tags / Topics (comma separated)" id="tags" error={errors.tags?.message}>
            <Input id="tags" placeholder="React, Performance" {...register("tags")} />
          </FormField>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="published"
              {...register("published")}
              className="h-4 w-4 rounded-sm border-border bg-background/50 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="published" className="text-sm font-semibold text-foreground cursor-pointer">
              Publish this article immediately (visible on site)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/20">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Saving..." : "Save Blog"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Blog Article?"
        message="Are you sure you want to remove this article? This deletes the file database record."
      />
    </div>
  );
}
